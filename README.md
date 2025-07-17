[![MseeP.ai Security Assessment Badge](https://mseep.net/pr/dosugamea-voicevox-mcp-server-badge.png)](https://mseep.ai/app/dosugamea-voicevox-mcp-server)

# Voicevox MCP Server

VOICEVOX互換の音声合成サーバー(AivisSpeech / VOICEVOX / COEIROINK) を MCP (Model Context Protocol) 経由で利用するためのサーバーです。
Cursor等でのClaude 3.7を使ったエージェントモードでの音声合成に利用できます。

## 必要条件

### Windows環境

- Node.js 18以上
- VOICEVOX ENGINE等 (ローカルでhttp://localhost:50000等で実行)
- VLCメディアプレーヤー（パスが通っていること）

### Docker環境 (WSL2)

- Docker と Docker Compose
- WSL2
- VOICEVOX ENGINE等 (ローカルまたはDockerで実行)
- `sudo apt install libsdl2-dev pulseaudio-utils pulseaudio` されたLinux環境
- `/mnt/wslg` へのアクセス権限

## インストールと設定

1. リポジトリをクローン
```
git clone https://github.com/Dosugamea/voicevox-mcp-server.git
cd voicevox-mcp-server
```

2. 依存関係のインストール
```
npm install
```

3. 環境変数の設定
`.env_example` をコピーして `.env` ファイルを作成し、必要に応じて設定を変更します:
```
VOICEVOX_API_URL=http://localhost:50021
VOICEVOX_SPEAKER_ID=1
```

## 実行方法

### Windows環境での実行
エディタと別途で下記手順でサーバーを立ち上げてください。

```
npm run build
npm start
```

### Docker環境での実行
エディタと別途での操作は不要です。
stdioモードで立ち上がるため直接実行することはできません。

## 設定方法

### Windows環境での実行の場合
mcp.jsonに下記を追記してください。
接続が不安定なため切断されたら再接続してください。

```json
        "voicevox": {
            "url": "http://localhost:10100/sse"
        }
```

### Docker環境での実行の場合
mcp.jsonに下記を追記してください。
(作者環境での動作は確認できていません)

```json
{
    "tools": {
        "voicevox": {
            "command": "cmd",
            "args": [
                "/c",
                "docker",
                "run",
                "-i",
                "--rm",
                "-v",
                "/mnt/wslg:/mnt/wslg",
                "-e",
                "PULSE_SERVER",
                "-e",
                "SDL_AUDIODRIVER",
                "-e",
                "VOICEVOX_API_URL",
                "-e",
                "VOICEVOX_SPEAKER_ID",
                "your-local-docker-image-name"
            ],
            "env": {
                "PULSE_SERVER": "unix:/mnt/wslg/PulseServer",
                "SDL_AUDIODRIVER": "pulseaudio",
                "VOICEVOX_API_URL": "http://host.docker.internal:50031",
                "VOICEVOX_SPEAKER_ID": "919692871"
            }
        }
    }
}
```

## 話者IDについて

話者IDは使用するVOICEVOXのモデルによって異なります。デフォルトでは「1」（四国めたん）を使用しています。
他の話者IDを使用する場合は、環境変数 `VOICEVOX_SPEAKER_ID` を変更してください。

話者IDの一覧は、VOICEVOX ENGINE APIの `/speakers` エンドポイントで確認できます。
例: `curl http://localhost:50021/speakers`

## トラブルシューティング

- **VOICEVOXとの接続エラー**: VOICEVOX ENGINEが起動していること、APIのURLが正しく設定されていることを確認してください。
- **音声が再生されない**: VLCが正しくインストールされていることと、パスが通っていることを確認してください。
- **Docker環境での音声出力問題**: pulseaudioの設定が正しいか確認してください。

## 開発者向け情報

- ソースコードに貢献する場合は、Issueを作成するか、Pull Requestを送信してください。
- バグ報告や機能リクエストは、GitHubのIssue機能をご利用ください。

## ライセンス

MIT License