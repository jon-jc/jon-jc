<h1 align="center">Jonathan Cho（ジョナサン・チョー）</h1>

<p align="center">
  <b>バックエンド／AI システムエンジニア — English / 日本語</b>
</p>

<p align="center">
  <a href="https://github.com/jon-jc">English</a> · <a href="README.ja.md">日本語</a>
</p>

<p align="center">
  フロントエンドは TypeScript と React ／ Python によるストリーミング音声処理 ／<br>
  Go によるイベント駆動のデータ取り込み ／ .NET によるデータ基盤 —<br>
  そしてその上に載るリアルタイムクライアント、地図、ダッシュボード。
</p>

<p align="center">
  <a href="https://jon-jc.vercel.app"><img src="https://img.shields.io/badge/Portfolio-111111?style=flat-square&logo=vercel&logoColor=white" alt="ポートフォリオ" /></a>
  <a href="https://linkedin.com/in/jon-jc"><img src="https://img.shields.io/badge/LinkedIn-0A66C2?style=flat-square&logo=linkedin&logoColor=white" alt="LinkedIn" /></a>
  <a href="mailto:Jonathancho.jc@gmail.com"><img src="https://img.shields.io/badge/Email-EA4335?style=flat-square&logo=gmail&logoColor=white" alt="メール" /></a>
  <img src="https://img.shields.io/badge/English%20%2F%20日本語-4c8c4a?style=flat-square" alt="English / 日本語" />
</p>

---

## 声 koe — 日英バイリンガル音声 AI ハーネス

**[github.com/jon-jc/koe-harness](https://github.com/jon-jc/koe-harness)** · `Python 3.11` `TypeScript` `FastAPI` `WebSocket` `Docker` `Terraform`

ストリーミング音声認識・話者分離・LLM による議事録生成を、単一のプラグインカーネル上で束ね、
**レイテンシ・コスト・品質のバジェット**に対して明示的に責任を持たせたシステムです。
音声プロダクトは単一のモデルで成立することはなく、実体は三つのモデルと大量の接合部であり、
エンジニアリングの本体はその接合部のほうにあります。

**日本語は「対応言語のひとつ」ではなく設計上の制約です。** 語の切れ目が存在しない言語において
WER はほぼ意味を持ちません（「単語」は分かち書き器に相対的にしか定義されないため、同じ音声に対して
同じ 12% を報告した二つのチームは、同じものを測っていません）。したがって評価は **CER** で行い、
WER を出す場合は必ず使用したトークナイザ名を添えています。漢数字変換は MeCab の品詞情報で
ゲートしています — `一般`・`一緒`・`十分` はいずれも数詞の漢字で始まりますが数ではなく、
素朴に変換すると `1般` という、何もしないより悪い結果になるためです。発話終端検出は言語ごとに
分けており、日本語は 900 ms、英語は 650 ms を無音許容としています。日本語話者は終助詞や丁寧表現の
手前で息を継ぐため、英語向けにチューニングされた終端検出は、否定と時制を担う述語をそのまま切り落とします。

**ハルシネーション検出を文字列処理に還元しました。** 議事録スキーマは、すべての記述に対して
**逐語の `source_quote` を必須**にしています。これにより検証は部分文字列照合になります —
引用が文字起こしの中に存在するか、しないか、それだけです。判定用モデルも追加の API 呼び出しも
不要で、コストは実質ゼロです。裏付けの取れない項目は「未検証」と印を付けるのではなく**削除**します。
未検証と書かれたアクションアイテムも、結局は誰かのタスクリストに残ってしまうからです。

**どのモデルを使うかは実行時の判断です。** 各バックエンドは自身のコスト・速度・想定品質をデータとして
登録し、リクエストは `Budget.realtime()` や `Budget.accurate()` のような形で要求を宣言します。
ルータはまずハード制約で候補を**除外**し（ライブ字幕の 200 ms 上限は、安さで相殺できる「好み」ではありません）、
残った候補の中で相対評価を行います。実測の誤り率がベンダー公称値を上書きするため、
ルーティングはカタログスペックではなく実測値へ収束していきます。

**不確実性は主張ではなく定量化の対象です。** すべての数値にブートストラップ信頼区間を付し、
A/B 比較には対応のあるブートストラップと並べ替え検定を用いています。リサンプリングは文字単位ではなく
**発話単位**で行います — 発話内の誤りは強く相関しており、文字を独立と見なすと分散を過小評価し、
正直とは言えないほど狭い区間が出てしまうためです。CI のリグレッションゲートは有意な悪化でのみ失敗し、
実行ごとのノイズでは失敗しません（ノイズで落ちるゲートは、再実行され、やがて無視されるだけです）。

<sub>有声性を見る VAD により適合率 <b>0.716 → 0.954</b>（再現率は不変、誤検出 0.00 回/分）· テスト 917 件 · <code>mypy --strict</code> クリーン · MeCab あり／なしのマトリクスを含む CI 8 ジョブ · Docker サービス・FastAPI サーバ・Windows デスクトップアプリとして配布 · Ollama / LM Studio / llama.cpp を用いて API キーなしの完全ローカル動作も可能</sub>

---

## 重ね Kasane — 日本語動画のリアルタイム英訳

**[japanese-live-transcriber.vercel.app](https://japanese-live-transcriber.vercel.app)** · `Python` `FastAPI` `Celery` `Redis` `faster-whisper` `UniDic` `Next.js` `Docker`

セルフホスト型の日英動画翻訳システムです。処理の進行に合わせて英語字幕が**逐次公開**され、
同期表示された日本語の各語は読み・語義・信頼度・用例のためにクリック可能なまま保たれます。
翻訳経路全体が自分のコンテナ内で完結するため、外部の推論 API も API キーも従量課金サービスも不要です。

**再生が推論を待つことはありません。** ワーカーは冒頭 12 秒を準備したうえで再生を解禁し、その後は
重なりを持たせた有界の音声ウィンドウで先行し続け、結果を SSE でブラウザへ送出します。Redis 上の
永続スナップショットと適応的ポーリングにより、接続が切れても最初からやり直しにはなりません。

**日本語には分かち書きがないため、形態素解析が前提になります。** Fugashi + UniDic による解析結果を
ローカルに索引した JMdict と Tatoeba の例文に接続し、読み・ヘボン式・品詞・二言語 SRT 書き出しを提供します。

**作業はフィンガープリント単位で重複排除されます。** 公開動画の解析は動画 ID と推論プロファイルで
キー付けされ、同一動画への同時リクエストは 1 本の推論タスクを共有します。トラッキングパラメータで
別タスクに分裂することはなく、アップロードされたファイルは共有キャッシュに入りません。

**デモではなく運用を前提とした構成です。** PR ごとに lint・型検査・本番ビルド・依存監査・アナライザの
テスト・Compose 検証・コンテナビルド・same-origin ヘルスチェックが走ります。main へのマージでは
OCI SBOM と provenance を伴う不変イメージを GHCR へ発行し、本番デプロイは保護環境配下のセルフホスト
ランナーに対するオプトイン方式です。公開面は Caddy のみで、TLS は自動終端、残りのサービスは
プライベートネットワークに閉じています。

---

## League Counters — 全地域の対戦データをパッチ単位で集計

**[github.com/jon-jc/league-counters](https://github.com/jon-jc/league-counters)** · `TypeScript` `Next.js 16` `React 19` `Tailwind v4`

Riot の全プラットフォームからランク戦の対戦データを取得し、パッチが落ち着くたびに再計算する
カウンターピック／ティア表です。要点は UI ではなく統計処理のほうにあります。この種のサイトの多くは
統計的に意味を持たない数字を公開していますが、本プロジェクトはそれを避けています。

**少数サンプルは公開せず、縮小推定にかけます。** チャンピオンの勝率は擬似 150 戦、
対面相性は擬似 40 戦の事前分布へ回帰させ、さらにランキング掲載は 20 戦、対面表示は 8 戦を下限としています。
9 戦での勝率 71% はノイズであり、それを推奨として提示することがこのジャンルの典型的な失敗です。

**対面相性は生の勝率ではなく勝率の「差分」で評価します。** 全試合で 54% 勝つチャンピオンが
ある対面で 54% 勝っていても、それは何もカウンターしていません。まず基準線を引く必要があります。

**地域をまたいで統合することが実用性の分かれ目です。** 単一地域では最大でも 722 レーンしか
スコアが付きませんが、統合ビューでは **3,090 レーン**になります。「この対面はデータなし」と
「答えが出る」の差です。ティアスコアは `0.72·z(勝率) + 0.28·z(使用率)` とし、
使用率をランキングに反映しつつ、静かに勝っているニッチなピックが埋もれないようにしています。

**取り込み側はデータ元の制約を尊重します。** トークンバケットにより Riot の 20 req/s および
2 分あたり 100 リクエストの制限を並行ワーカー全体で遵守するため、全地域クロールが途中で
スロットリングされずに完走します。

---

## Fluxgate — 分散テレメトリ取り込み基盤

**[github.com/jon-jc/fluxgate](https://github.com/jon-jc/fluxgate)** · `Go` `GCP Pub/Sub` `PostgreSQL` `Cloud Run` `Terraform` `OpenTelemetry`

大量のメトリクスポイントを HTTP で受け取り、永続的なイベントバスへ publish し、
ステートレスなワーカー群でイベント時刻ウィンドウに集約し、その結果をクエリ API で返す
3 サービス構成のプラットフォームです。

**202 は「ブローカーが受け取った」という意味です。** Pub/Sub の ack を待ってから応答を返します。
プロセス内にバッファして即座に返すほうが速いのは事実ですが、それは耐久性についての虚偽であり、
しかも耐久性こそがこのプロダクトの価値そのものである場面で吐く嘘です。

**再配信下でも集計は厳密に一度だけ**行われます。`(batch, window)` をキーとする配信台帳を持ち、
ロールアップと台帳エントリを同一トランザクションでコミットします。再配信はブローカーにとって
正常動作ですが、メトリクスの二重計上は正常ではありません。

**部分的な成功は、丸めずにそのまま返します。** バッチ中の 1 件が不正でも、どの点が取り込まれ、
残りがなぜ失敗したかを返します。バッチ全体を拒否してクライアント側に二分探索させることはしません。

**カーディナリティは構造的に上限が決まっています** — ラベルは生パスではなくルートパターンから
生成するため、独創的な URL を投げてくる呼び出し元がメトリクス基盤を落とすことはできません。
サーキットブレーカーは依存先の障害をタイムアウト待ち行列ではなく即時の 503 に変換し、
3 段階のドレインによりデプロイ時のリクエスト取りこぼしを防ぎます。

<sub>持続 <b>8,970 points/s</b>、p99 <b>60.7 ms</b> · 10 秒ウィンドウに対するウォーターマーク遅延 4.2 秒 · ファジングターゲット、実サービスに対する統合テスト、サービスごとのサービスアカウント・デッドレター・4 種のアラートポリシーを含む GCP 全体の Terraform 化</sub>

---

## SpillSense — 環境データ管理・GIS プラットフォーム

**[spillsense.vercel.app](https://spillsense.vercel.app)** · [ソース](https://github.com/jon-jc/spillsense) · `C#` `ASP.NET Core` `EF Core` `SQL Server / SQLite` `Leaflet`

ワシントン州の油等流出事故データを管理・分析するプラットフォームです。CRUD の雛形から出てくる形ではなく、
実際の流出対応プログラムの業務手順に合わせてモデリングしています。

**監査可能な ETL 取り込み。** 各行は全ルールを一括で検証し、不合格の行は破棄せず、
失敗理由を添えて**原文のまま隔離**します。修正が必要な行とは、たった今削除してしまった行だからです。
同一ファイルの再取り込みは自然キーにより冪等です。

**空間検証は境界で行います。** 州全域の WGS 84 境界により、緯度経度の入れ替わりや不正な座標を
データベース到達前に捕捉します。39 郡はすべて FIPS コードと州環境局（Ecology）の管轄区分付きで
シードしてあり、地理情報を自由入力ではなく参照データとして扱えるようにしています。

**デプロイ先は 2 つ、契約は 1 つ。** データベースと取り込みパイプラインを保持する ASP.NET Core の
システム・オブ・レコードと、公開スナップショットを配信するサーバーレスのリードレプリカを併用し、
両者を 109 件の自動テストで固定しています — 実マイグレーションを流す xUnit の統合テストと、
2 つのホストの乖離を防ぐ `node:test` の契約テストです。

<sub>バウンディングボックスによる空間クエリ、RFC 7946 準拠 GeoJSON、統計ロールアップ、年次レポート、CSV 出力を 11 の OpenAPI 記述済みエンドポイントで提供 · クラスタリング地図、傾向・物質別分析、URL に載る共有可能なフィルタ状態、取り込み監査ビュー</sub>

---

## その他の TypeScript / React 案件

| プロジェクト | 概要 | 技術 |
|---|---|---|
| **[NEO TOKYO TRANSIT](https://tokyo-train-map.vercel.app)** · [ソース](https://github.com/jon-jc/tokyo-train-map) | 東京の鉄道網 22 路線・269 駅を 3D で探索できる地図。JR・東京メトロ・都営・ゆりかもめ・りんかい線を収録し、列車はダイヤに沿って双方向にアニメーションします。実用的な経路検索も兼ねており、乗り換えペナルティを考慮したダイクストラ法と出口レベルの案内、全体を日英二言語対応。 | `Next.js 15` `React 19` `three.js` `R3F` `zustand` |
| **[ChordLab](https://chord-finder-ten.vercel.app)** · [ソース](https://github.com/jon-jc/chord-finder) | 音源を一切アップロードせず、ブラウザ内で完結する楽曲解析。145 状態の和音認識をビタビ復号で平滑化し、Krumhansl–Schmuckler 法による調性推定、音符単位の採譜からギタータブ譜生成、MIDI 書き出しまで行います。FFT・クロマグラム・オンセット検出・ピッチ推定はすべて自前実装で **実行時依存ゼロ**、処理は Web Worker 上でメインスレッド外に逃がしています。 | `TypeScript` `Web Audio` `Web Workers` `DSP` |
| **[LanguageRooms](https://github.com/jon-jc/language-rooms)** | 言語と CEFR レベル別の常設練習ルーム。セルフホストの LiveKit SFU 上に、多人数のビデオ・音声、写真アップロード対応の共有ホワイトボード、ホスト権限、話者検出、接続品質表示を実装。モデレーション・通報・審査キューを後付けではなく第一級のサブシステムとして設計しています。 | `Next.js` `LiveKit` `Prisma` `Postgres` `JWT` |
| **[東京 初期費用計算ツール](https://apartmentfeesjapan.vercel.app)** · [ソース](https://github.com/jon-jc/apartmentfeesjapan) | 日本の賃貸契約は入居前に家賃 4.5〜6 か月分を要求します。敷金・礼金・仲介手数料・保証会社・火災保険を含む初期費用の全体を、SUUMO / HOME'S の最新相場に基づく 23 区のコロプレス地図と併せてモデル化。区界データはビルド時に約 28 KB の SVG パスへ事前コンパイルし、23 区の解説ページは ISR で日次再生成。全体を日英二言語対応。 | `Next.js` `TypeScript` `ISR` `i18n` |
| **[ポートフォリオ](https://jon-jc.vercel.app)** · [ソース](https://github.com/jon-jc/portfolio) | プロジェクト・経歴・スキルをデータとして持ち、ルート・サイトマップ・メタデータ・プロジェクト別 OG 画像をすべてビルド時に生成するコンテンツ駆動サイト。あいまい検索付きコマンドパレット、ポインタ追従カーソル、スクロール連動の演出、シード付き乱数から描く手描き風 SVG ポスター、印刷最適化した履歴書ルートを実装。全ルート事前レンダリングでクライアント側フェッチなし。 | `Next.js 16` `React 19` `TypeScript` `Motion` |

---

## 日本語対応は「翻訳」ではなく設計課題です

日本語のユーザーに向けて作ると、英語前提のコードが一度も疑わずに済んできた前提が次々に壊れます。
以下は、実際に手を動かして初めて分かったものです。

| 英語前提の思い込み | 日本語で破綻する理由 | 採った対応 |
|---|---|---|
| 語はスペースで区切られている | 区切りは存在せず、「単語」は分かち書き器に相対的にしか定義されない。同じ音声に同じ WER を報告した二者は、同じものを測っていない | 評価は **CER**。WER を出す際は必ずトークナイザ名を併記 |
| 1 トークンはおよそ 4 文字 | 漢字の多くは 1 文字で 1 トークン。`len // 4` 型の推定は日本語の文字起こしを **4.6 倍**過小に見積もり、それを使ったコンテキスト管理は余裕があると信じたまま上限を突破する | 字種ごとに数え、推定ではなく実測に基づかせる |
| 数詞の漢字は数である | `一般`・`一緒`・`十分` はいずれも数詞の漢字で始まるが数ではない。素朴な変換は `1般` を生み、何もしないより悪い | 漢数字変換を MeCab の品詞情報でゲートし、MeCab 不在時は保守的なストップリストへフォールバック |
| 無音は文の終わり | 日本語話者は終助詞や丁寧表現の手前で息を継ぐ。否定と時制を担う述語がそこにあるため、英語向け終端検出は述語ごと切り落とす | 発話終端検出を言語別に分離（日本語 900 ms／英語 650 ms） |
| 小型の多言語モデルは緩やかに劣化する | Whisper の小型チェックポイントは限られた多言語能力を英語に近い言語へ費やしており、日本語の出力は実用に耐えない | 該当サイズを UI 上で**日本語には非推奨**と明示。議事録の文字起こしで気づかせない |

---

## 使用技術

**フロントエンド** — TypeScript, React 19, Next.js（App Router）, Tailwind CSS, three.js, Motion, WebSocket / SSE, WebRTC・LiveKit, Web Audio・Web Workers, i18n, アクセシブルかつテーマ対応可能な UI

**バックエンド／データ** — Go, C#, ASP.NET Core, EF Core, Python, FastAPI, Node.js, PostgreSQL, SQL Server, Redis, SQLite, Prisma, REST/OpenAPI, イベント駆動アーキテクチャ, ETL パイプライン設計

**AI／音声** — ストリーミング音声認識, 話者分離, LLM オーケストレーションとガードレール, 評価ハーネス（CER/WER/DER・ブートストラップ信頼区間・リグレッションゲート）, VAD と発話終端検出, DSP

**GIS／可視化** — Leaflet, GeoJSON, 空間クエリ, 座標系の検証, コロプレス図, Chart.js

**デリバリー** — Docker, Terraform, GitHub Actions, GCP（Pub/Sub, Cloud Run）, AWS（ECS Fargate）, Vercel, xUnit, pytest, Vitest, 統合テスト・契約テスト, ファジング

<p align="left">
<a href="https://www.typescriptlang.org/" target="_blank"><img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/typescript/typescript-original.svg" width="40" height="40" alt="TypeScript"/></a>
<a href="https://reactjs.org/" target="_blank"><img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/react/react-original-wordmark.svg" width="40" height="40" alt="React"/></a>
<a href="https://nextjs.org/" target="_blank"><img src="https://cdn.worldvectorlogo.com/logos/nextjs-2.svg" width="40" height="40" alt="Next.js"/></a>
<a href="https://tailwindcss.com/" target="_blank"><img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/tailwindcss/tailwindcss-original.svg" width="40" height="40" alt="Tailwind CSS"/></a>
<a href="https://threejs.org/" target="_blank"><img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/threejs/threejs-original.svg" width="40" height="40" alt="three.js"/></a>
<a href="https://nodejs.org/" target="_blank"><img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/nodejs/nodejs-original-wordmark.svg" width="40" height="40" alt="Node.js"/></a>
<a href="https://go.dev/" target="_blank"><img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/go/go-original-wordmark.svg" width="40" height="40" alt="Go"/></a>
<a href="https://learn.microsoft.com/dotnet/csharp/" target="_blank"><img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/csharp/csharp-original.svg" width="40" height="40" alt="C#"/></a>
<a href="https://dotnet.microsoft.com/" target="_blank"><img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/dotnetcore/dotnetcore-original.svg" width="40" height="40" alt=".NET"/></a>
<a href="https://www.python.org/" target="_blank"><img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/python/python-original.svg" width="40" height="40" alt="Python"/></a>
<a href="https://fastapi.tiangolo.com/" target="_blank"><img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/fastapi/fastapi-original.svg" width="40" height="40" alt="FastAPI"/></a>
<a href="https://www.postgresql.org/" target="_blank"><img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/postgresql/postgresql-original-wordmark.svg" width="40" height="40" alt="PostgreSQL"/></a>
<a href="https://www.microsoft.com/sql-server" target="_blank"><img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/microsoftsqlserver/microsoftsqlserver-plain-wordmark.svg" width="40" height="40" alt="SQL Server"/></a>
<a href="https://redis.io/" target="_blank"><img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/redis/redis-original-wordmark.svg" width="40" height="40" alt="Redis"/></a>
<a href="https://www.sqlite.org/" target="_blank"><img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/sqlite/sqlite-original-wordmark.svg" width="40" height="40" alt="SQLite"/></a>
<a href="https://www.docker.com/" target="_blank"><img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/docker/docker-original-wordmark.svg" width="40" height="40" alt="Docker"/></a>
<a href="https://www.terraform.io/" target="_blank"><img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/terraform/terraform-original.svg" width="40" height="40" alt="Terraform"/></a>
<a href="https://cloud.google.com/" target="_blank"><img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/googlecloud/googlecloud-original-wordmark.svg" width="40" height="40" alt="Google Cloud"/></a>
<a href="https://aws.amazon.com/" target="_blank"><img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/amazonwebservices/amazonwebservices-original-wordmark.svg" width="40" height="40" alt="AWS"/></a>
<a href="https://github.com/features/actions" target="_blank"><img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/githubactions/githubactions-original.svg" width="40" height="40" alt="GitHub Actions"/></a>
<a href="https://git-scm.com/" target="_blank"><img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/git/git-original-wordmark.svg" width="40" height="40" alt="Git"/></a>
</p>

---

## 📊 GitHub

<p align="left">
  <img src="https://streak-stats.demolab.com?user=jon-jc&theme=transparent&hide_border=true" height="200" alt="コントリビューション連続日数" />
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="assets/top-languages-dark.svg" />
    <img src="assets/top-languages-light.svg" height="200" alt="公開リポジトリで最も使用している言語" />
  </picture>
</p>

<sub>言語カードは GitHub API から生成し、<a href=".github/workflows/language-card.yml">スケジュール実行のワークフロー</a>がこのリポジトリへコミットしています。外部の統計サービスに依存しないため、レート制限や障害の影響を受けません。</sub>

---

<p align="center">
  <i>米国および日本でのソフトウェアエンジニア職を探しています。日英バイリンガル対応可。<br>
  <a href="mailto:Jonathancho.jc@gmail.com">Jonathancho.jc@gmail.com</a> · <a href="https://linkedin.com/in/jon-jc">LinkedIn</a> · <a href="README.md">English</a></i>
</p>
