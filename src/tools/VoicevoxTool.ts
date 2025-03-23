// src/tools/VoicevoxTool.ts
import { MCPTool } from "mcp-framework";
import { z } from "zod";
import axios from "axios";
import fs from "fs";
import process from "node:process";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

interface VoicevoxInput {
  text: string;
}

class VoicevoxTool extends MCPTool<VoicevoxInput> {
  name = "voicevox";
  description =
    "VOICEVOXを使用して音声を合成し、ホストコンピュータで再生します";

  schema = {
    text: {
      type: z.string(),
      description: "合成する文章",
    },
  };

  private readonly VOICEVOX_API_URL = process.env.VOICEVOX_API_URL;
  private readonly VOICEVOX_API_SPEAKER_ID = process.env.VOICEVOX_SPEAKER_ID;
  private readonly TEMP_AUDIO_FILE = "./tmp/voicevox_audio.wav";

  async execute({ text }: VoicevoxInput): Promise<string> {
    try {
      // 音声合成用のクエリを作成
      const queryResponse = await axios.post(
        `${this.VOICEVOX_API_URL}/audio_query`,
        null,
        { params: { text, speaker: this.VOICEVOX_API_SPEAKER_ID } }
      );

      // 音声を合成
      const synthesisResponse = await axios.post(
        `${this.VOICEVOX_API_URL}/synthesis`,
        queryResponse.data,
        {
          params: { speaker: this.VOICEVOX_API_SPEAKER_ID },
          responseType: "arraybuffer",
        }
      );

      // 音声データを一時ファイルに保存
      fs.writeFileSync(
        this.TEMP_AUDIO_FILE,
        Buffer.from(synthesisResponse.data)
      );

      // 音声を再生
      await this.playAudio(this.TEMP_AUDIO_FILE);

      return `「${text}」の音声をホストコンピュータで再生しました。話者ID: ${this.VOICEVOX_API_SPEAKER_ID}`;
    } catch (error) {
      console.log(error);
      if (error instanceof Error) {
        throw new Error(`音声合成または再生に失敗しました: ${error.message}`);
      }
      throw new Error("音声合成または再生に失敗しました");
    }
  }

  private async playAudio(filePath: string): Promise<void> {
    try {
      switch (process.platform) {
        // Windows
        case "win32":
          await execAsync(
            `vlc.exe -I dummy --dummy-quiet ${filePath} vlc://quit`
          );
          break;
        // Linux or Docker
        case "linux":
          await execAsync(`aplay ${filePath}`);
          break;
        // Mac
        case "darwin":
        default:
          throw new Error("サポートされていないOSです");
      }
    } catch (error) {
      throw new Error(`音声の再生に失敗しました: ${error}`);
    }
  }
}

export default VoicevoxTool;
