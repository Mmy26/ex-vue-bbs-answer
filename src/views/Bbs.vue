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

      <CompCommentForm v-bind:aritcle-id="article.id" />

      <hr />
    </div>
  </div>
</template>

<script lang="ts">
import { Article } from "@/types/article";
import { Component, Vue } from "vue-property-decorator";
import CompCommentForm from "@/components/CompCommentForm.vue";

@Component({
  components: {
    CompCommentForm,
  },
})
export default class Bbs extends Vue {
  // 現在の記事一覧
  private currentArticleList = new Array<Article>();
  // 投稿者名
  private articleName = "";
  // 投稿者名エラーメッセージ
  private articleNameErrorMessage = "";
  // 投稿内容
  private articleContent = "";
  // 投稿内容エラーメッセージ
  private articleContentErrorMessage = "";

  /**
   * 記事一覧を表示する.
   *
   * @remarks
   * Vuexストア内の記事一覧(articles)をcurrentArticleListに格納します。
   * このメソッドはライフサイクルフックのメソッドです。
   *
   */
  created(): void {
    this.currentArticleList = this.$store.getters.getArticles;
  }

  /**
   * 記事を追加する.
   */
  addArticle(): void {
    // (上級課題)入力値チェック
    // 今までのエラーメッセージを削除
    this.articleNameErrorMessage = "";
    this.articleContentErrorMessage = "";

    let hasErrors = false;
    if (this.articleName === "") {
      this.articleNameErrorMessage = "投稿者名を入力してください";
      hasErrors = true;
    } else if (50 < this.articleName.length) {
      this.articleNameErrorMessage = "投稿者名は50文字以内で入力してください";
      hasErrors = true;
    }

    if (this.articleContent === "") {
      this.articleContentErrorMessage = "投稿内容を入力してください";
      hasErrors = true;
    } else if (50 < this.articleContent.length) {
      this.articleContentErrorMessage =
        "投稿内容は50文字以内で入力してください";
      hasErrors = true;
    }

    if (hasErrors) {
      // エラーがひとつでもあった場合は追加しない
      return;
    }

    // 正常処理
    // ミューテーションのaddArticleメソッドを呼ぶ
    // ※この時渡すコメントIDは-1にする(通常はWebAPI、今回はVuexストアで採番するため)
    // 第２引数には「名前：値,・・・」のオブジェクト形式で渡す
    // ミューテーションに渡す引数のことを「ペイロード」という
    this.$store.commit("addArticle", {
      article: new Article(-1, this.articleName, this.articleContent, []),
    });
    // 入力値をフォームからクリアする
    this.articleName = "";
    this.articleContent = "";
  }

  /**
   * 記事を削除する.
   *
   * @param articleIndex - 記事のINDEX番号
   */
  deleteArticle(articleIndex: number): void {
    // ミューテーションのdeleteArticleメソッドを呼ぶ
    // 第２引数には「名前：値,・・・」のオブジェクト形式で渡す
    // ミューテーションに渡す引数のことを「ペイロード」という
    this.$store.commit("deleteArticle", {
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
