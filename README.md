# PRP再生医療 ヒアリングフォーム

PRP 2種（関節内）・3種（関節外）同時申請対応の様式1-2作成ヒアリングフォーム。  
Claude AIによるWebからの医療機関情報自動入力機能付き。

## デプロイ手順

### 1. このリポジトリをフォーク or クローン

GitHubで「Fork」ボタンを押すか、ダウンロードしてください。

### 2. Vercelにデプロイ

1. https://vercel.com にアクセス
2. 「Sign Up」→「Continue with GitHub」でGitHubアカウントでログイン
3. 「New Project」→「Import」でこのリポジトリを選択
4. 「Environment Variables」に以下を追加：
   - `ANTHROPIC_API_KEY` = `sk-ant-xxxxxxxx...`（Anthropicのダッシュボードから取得）
5. 「Deploy」を押す

### 3. 完成

`https://your-project.vercel.app` のようなURLが発行されます。  
ブラウザで開いてそのまま使えます。

## 機能

- クリニック名またはURLを入力→AI（Claude）がWebから自動収集・フォーム反映
- 2種・3種の同時申請対応（共通項目は一度だけ入力）
- 一部項目を2種・3種で分ける「分割」トグル
- 書類プレビュー→PDF出力（ブラウザ印刷）

## 環境変数

| 変数名 | 内容 |
|--------|------|
| `ANTHROPIC_API_KEY` | Anthropic APIキー（必須） |
