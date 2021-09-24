<template>
  <div class="container">
    <h1>掲示板アプリケーション(Vue.js版)</h1>
    <div class="error">{{ commentsErrorMessage }}</div>
    <form>
      <div class="error">{{ articleNameErrorMessage }}</div>
      <div>投稿者名：<input type="text" v-model="articleName" /></div>
      <div class="error">{{ articleContentErrorMessage }}</div>
      <div>
        投稿内容：<textarea
          v-model="articleContent"
          rows="5"
          cols="25"
        ></textarea>
      </div>
      <button type="button" v-on:click="addArticle()">記事投稿</button>
    </form>
    <hr />
    <div
      v-for="(article, articleIndex) of currentArticleList"
      v-bind:key="article.id"
    >
      <div>記事INDEX：{{ articleIndex }}</div>
      <div>記事ID：{{ article.id }}</div>
      <div>投稿者名：{{ article.name }}</div>
      <div>
        投稿内容：
        <pre>{{ article.content }}</pre>
      </div>
      <form>
        <button type="button" v-on:click="deleteArticle(articleIndex)">
          記事削除
        </button>
      </form>
      <br />

      <div v-for="comment of article.commentList" v-bind:key="comment.id">
        <div>コメント者名：{{ comment.name }}</div>
        <div>
          コメント内容：
          <pre>{{ comment.content }}</pre>
        </div>
      </div>
      <form>
        <div class="error">
          {{ commentNameOfArticlesErrorMessage[articleIndex] }}
        </div>
        名前:<br />
        <input type="text" v-model="commentNameOfArticles[articleIndex]" />
        <br />
        <div class="error">
          {{ commentContentOfArticlesErrorMessage[articleIndex] }}
        </div>
        コメント:<br />
        <textarea
          rows="5"
          cols="25"
          v-model="commentContentOfArticles[articleIndex]"
        ></textarea>
        <br />
        <button type="button" v-on:click="addComment(article.id, articleIndex)">
          コメント投稿
        </button>
      </form>
      <hr />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class Bbs extends Vue {
  // 現在の記事一覧
  currentArticleList = [];
  // 投稿者名
  articleName = "";
  articleNameErrorMessage = "";
  // 投稿内容
  articleContent = "";
  articleContentErrorMessage = "";

  // (上級課題)コメント入力欄と関連づける変数(複数あるため配列で持つ)
  commentNameOfArticles: Array<string> = [];
  commentNameOfArticlesErrorMessage: Array<string> = [];
  commentContentOfArticles: Array<string> = [];
  commentContentOfArticlesErrorMessage: Array<string> = [];
  commentsErrorMessage = "";

  /**
   * 記事一覧を表示する.
   *
   * @remarks
   * Vuexストア内の記事一覧(articles)をcurrentArticleListに格納します。
   * このメソッドはライフサイクルフックのメソッドです。
   *
   */
  created(): void {
    this.currentArticleList = this["$store"].getters.getArticles;

    // (上級課題)コメント入力欄が複数あるため記事分配列を空文字で初期化する
    for (let i = 0; i < this.currentArticleList.length; i++) {
      this.commentNameOfArticles[i] = "";
      this.commentNameOfArticlesErrorMessage[i] = "";
      this.commentContentOfArticles[i] = "";
      this.commentContentOfArticlesErrorMessage[i] = "";
    }
  }
  /**
   * Vuexストア内の記事一覧を取得し返す.
   *
   * @returns 記事一覧情報
   */
  // get articleList(): Array<Article> {
  //   return this["$store"].getters.getArticles;
  // }

  /**
   * 記事を追加する.
   */
  addArticle(): void {
    // (上級課題)入力値チェック
    let hasErrors = false;
    if (this.articleName === "") {
      this.articleNameErrorMessage = "投稿者名を入力してください";
      hasErrors = true;
    } else if (50 < this.articleName.length) {
      this.articleNameErrorMessage = "投稿者名は50文字以内で入力してください";
      hasErrors = true;
    } else {
      this.articleNameErrorMessage = "";
    }

    if (this.articleContent === "") {
      this.articleContentErrorMessage = "投稿内容を入力してください";
      hasErrors = true;
    } else if (50 < this.articleContent.length) {
      this.articleContentErrorMessage =
        "投稿内容は50文字以内で入力してください";
      hasErrors = true;
    } else {
      this.articleContentErrorMessage = "";
    }

    if (hasErrors) {
      // エラーがひとつでもあった場合は追加しない
      return;
    }

    // 正常処理
    // 最新の記事IDに１プラスする形で記事IDを作成する
    let articles = this["$store"].getters.getArticles;
    let newId = 0;
    // もし記事が１件でもあれば最後の記事IDに1を足したものをIDとする
    if (articles.length) {
      newId = articles[0].id + 1;
    }
    // ミューテーションのaddArticleメソッドを呼ぶ
    // 第２引数には「名前：値,・・・」のオブジェクト形式で渡す
    // ミューテーションに渡す引数のことを「ペイロード」という
    this["$store"].commit("addArticle", {
      article: {
        id: newId,
        name: this.articleName,
        content: this.articleContent,
        commentList: [],
      },
    });
    // 入力値をフォームからクリアする
    this.articleName = "";
    this.articleContent = "";
  }

  /**
   * コメントを追加する.
   *
   * @param articleId : 記事ID
   * @param articleIndex : 記事Index
   */
  addComment(articleId: number, articleIndex: number): void {
    // (上級課題)入力値チェック
    // 今までのエラーメッセージを削除
    for (let i = 0; i < this.currentArticleList.length; i++) {
      this.commentNameOfArticlesErrorMessage[i] = "";
      this.commentContentOfArticlesErrorMessage[i] = "";
    }
    this.commentsErrorMessage = "";

    let hasErrors = false;
    if (this.commentNameOfArticles[articleIndex] === "") {
      this.commentNameOfArticlesErrorMessage[articleIndex] =
        "コメント者名を入力してください";
      hasErrors = true;
    } else if (50 < this.commentNameOfArticles[articleIndex].length) {
      this.commentNameOfArticlesErrorMessage[articleIndex] =
        "コメント名は50文字以内で入力してください";
      hasErrors = true;
    } else {
      this.commentNameOfArticlesErrorMessage[articleIndex] = "";
    }

    if (this.commentContentOfArticles[articleIndex] === "") {
      this.commentContentOfArticlesErrorMessage[articleIndex] =
        "コメント内容を入力してください";
      hasErrors = true;
    } else if (50 < this.commentContentOfArticles[articleIndex].length) {
      this.commentContentOfArticlesErrorMessage[articleIndex] =
        "コメント内容は50文字以内で入力してください";
      hasErrors = true;
    } else {
      this.commentContentOfArticlesErrorMessage[articleIndex] = "";
    }

    if (hasErrors) {
      // エラーがひとつでもあった場合は追加しない
      this.commentsErrorMessage =
        "コメント関連でエラーが発生しました。エラーメッセージをよく見て対応してください"; // ←このように直接変数の更新をやらないと配列ないのエラーメッセージが出てこない(更新が反映されない)
      return;
    }

    // 正常処理
    // ミューテーションのaddCommentメソッドを呼ぶ
    // ※この時渡すコメントIDはnullで良い
    // 第２引数には「名前：値,・・・」のオブジェクト形式で渡す
    // ミューテーションに渡す引数のことを「ペイロード」という
    this["$store"].commit("addComment", {
      comment: {
        id: null,
        name: this.commentNameOfArticles[articleIndex],
        content: this.commentContentOfArticles[articleIndex],
        articleId: articleId,
      },
    });
    // 入力値をフォームからクリアする
    this.commentNameOfArticles[articleIndex] = "";
    this.commentContentOfArticles[articleIndex] = "";
  }

  /**
   * 記事を削除する.
   *
   * @param articleId : 記事ID
   */
  deleteArticle(articleIndex: number): void {
    // ミューテーションのdeleteArticleメソッドを呼ぶ
    // 第２引数には「名前：値,・・・」のオブジェクト形式で渡す
    // ミューテーションに渡す引数のことを「ペイロード」という
    this["$store"].commit("deleteArticle", {
      articleIndex: articleIndex,
    });
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1 {
  font-size: 30px;
}
pre {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
}
</style>
