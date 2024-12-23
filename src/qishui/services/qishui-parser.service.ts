import { Injectable } from '@nestjs/common';
import { MusicInfo, LyricsData, LyricLine } from '../interfaces/music.interface';

@Injectable()
export class QishuiParserService {
  private readonly headers: HeadersInit = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
    'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
    'Accept-Encoding': 'gzip, deflate, br',
    'Connection': 'keep-alive'
  };

  private readonly timeout = 10000;
  private readonly maxRetries = 3;

  private async getRealUrl(shareUrl: string): Promise<{ url: string; content: string } | null> {
    for (let i = 0; i < this.maxRetries; i++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);

        const response = await fetch(shareUrl, {
          headers: this.headers,
          redirect: 'follow',
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) continue;

        const content = await response.text();
        return { url: response.url, content };
      } catch {
        continue;
      }
    }
    return null;
  }

  private extractTrackInfo(url: string): { track_id: string | null } {
    try {
      const urlObj = new URL(url);
      const params = new URLSearchParams(urlObj.search);
      return {
        track_id: params.get('track_id')
      };
    } catch {
      return { track_id: null };
    }
  }

  private extractPageData(htmlContent: string): Partial<MusicInfo> | null {
    try {
      const routerPattern = /<script>window\._ROUTER_DATA\s*=\s*({[^<]+})<\/script>/;
      const routerMatch = routerPattern.exec(htmlContent);
      
      if (!routerMatch) return null;
      
      const routerData = JSON.parse(routerMatch[1]);
      if (!('loaderData' in routerData && 'track_page' in routerData.loaderData)) {
        return null;
      }
      
      const trackData = routerData.loaderData.track_page;
      const audioData = trackData.audioWithLyricsOption || {};
      
      let isPreview = false;
      const duration = audioData.duration || 0;
      if (duration > 0) {
        isPreview = duration <= 35000;
      }
      
      const titlePattern = /<title[^>]*>《([^���]+)》@汽水音乐<\/title>/;
      const artistPattern = /<span class="artist-name-max">([^<]+)<\/span>/;
      const coverPattern = /<img src="([^"]+)" style="height:100%;width:100%" alt="a-image"/;

      const titleMatch = titlePattern.exec(htmlContent);
      const artistMatch = artistPattern.exec(htmlContent);
      const coverMatch = coverPattern.exec(htmlContent);

      return {
        title: titleMatch ? titleMatch[1] : "未知歌曲",
        artist: artistMatch ? artistMatch[1] : "未知艺术家",
        track_id: trackData.track_id,
        audio_url: audioData.url || null,
        cover_url: coverMatch ? coverMatch[1] : null,
        lyrics: this.extractLyrics(audioData),
        is_preview: isPreview,
        duration: duration > 0 ? Math.round(duration / 1000 * 100) / 100 : null
      };
    } catch {
      return null;
    }
  }

  private extractLyrics(audioData: any): LyricsData | null {
    try {
      const lyricsData = audioData.lyrics;
      if (!(lyricsData && 'sentences' in lyricsData)) {
        return null;
      }

      const makerInfo = audioData.songMakerTeamSentences || [];
      const lyrics: LyricLine[] = [];

      for (const sentence of lyricsData.sentences) {
        if (!('text' in sentence && sentence.text)) {
          continue;
        }
        
        if (makerInfo.includes(sentence.text)) {
          continue;
        }
        
        const startTime = sentence.startMs || 0;
        let endTime = sentence.endMs || 0;
        
        if (endTime === 9007199254740991) {
          endTime = -1;
        }

        lyrics.push({
          text: sentence.text,
          start: Math.round(startTime / 1000 * 100) / 100,
          end: endTime > 0 ? Math.round(endTime / 1000 * 100) / 100 : -1
        });
      }
      
      return {
        maker_info: makerInfo,
        lyrics
      };
    } catch {
      return null;
    }
  }

  async getMusicInfo(shareUrl: string): Promise<MusicInfo> {
    try {
      const realUrlData = await this.getRealUrl(shareUrl);
      if (!realUrlData) {
        return { status: "error", msg: "无法获取真实URL" };
      }

      const trackInfo = this.extractTrackInfo(realUrlData.url);
      if (!trackInfo.track_id) {
        return { status: "error", msg: "无法获取track_id" };
      }

      const musicData = this.extractPageData(realUrlData.content);
      if (!musicData) {
        return { status: "error", msg: "无法从页面提取数据" };
      }

      return {
        status: "success",
        ...musicData
      };
    } catch (e) {
      return { 
        status: "error", 
        msg: e instanceof Error ? e.message : "未知错误"
      };
    }
  }

  async fetchAudio(audioUrl: string): Promise<Response> {
    const response = await fetch(audioUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': '*/*',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
        'Accept-Encoding': 'identity;q=1, *;q=0',
        'Range': 'bytes=0-',
        'Referer': 'https://qishui.douyin.com/',
        'Origin': 'https://qishui.douyin.com',
        'Sec-Fetch-Dest': 'audio',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'cross-site'
      },
      redirect: 'follow',
      credentials: 'include'
    });

    if (!response.ok) {
      console.error('Audio fetch failed:', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries())
      });
      throw new Error(`Failed to fetch audio: ${response.status} ${response.statusText}`);
    }

    return response;
  }
} 