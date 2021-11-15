<template>
  <div class="ex">
    <form>
      <div class="error">
        {{ commentNameErrorMessage }}
      </div>
      名前:<br />
      <input type="text" v-model="commentName" />
      <br />
      <div class="error">
        {{ commentContentErrorMessage }}
      </div>
      コメント:<br />
      <textarea rows="5" cols="25" v-model="commentContent"></textarea>
      <br />
      <button type="button" v-on:click="addComment(aritcleId)">
        コメント投稿
      </button>
    </form>
  </div>
</template>

<script lang="ts">
import { Prop, Component, Vue } from "vue-property-decorator";
import { Comment } from "@/types/comment";

/**
 * コメントフォームコンポーネント.
 */
@Component
export default class CompCommentForm extends Vue {
  // 親コンポーネントから受け取る記事ID
  @Prop()
  private aritcleId!: number;

  // コメント者名
  private commentName = "";
  // コメント者名エラーメッセージ
  private commentNameErrorMessage = "";
  // コメント内容
  private commentContent = "";
  // コメント内容エラーメッセージ
  private commentContentErrorMessage = "";

  /**
   * コメントを追加する.
   *
   * @param articleId : 記事ID
   */
  addComment(articleId: number): void {
    // (上級課題)入力値チェック
    // 今までのエラーメッセージを削除
    this.commentNameErrorMessage = "";
    this.commentContentErrorMessage = "";

    let hasErrors = false;
    if (this.commentName === "") {
      this.commentNameErrorMessage = "コメント者名を入力してください";
      hasErrors = true;
    } else if (50 < this.commentName.length) {
      this.commentNameErrorMessage = "コメント名は50文字以内で入力してください";
      hasErrors = true;
    }

    if (this.commentContent === "") {
      this.commentContentErrorMessage = "コメント内容を入力してください";
      hasErrors = true;
    } else if (50 < this.commentContent.length) {
      this.commentContentErrorMessage =
        "コメント内容は50文字以内で入力してください";
      hasErrors = true;
    }

    if (hasErrors) {
      // エラーがひとつでもあった場合は追加しない
      return;
    }

    // 正常処理
    // ミューテーションのaddCommentメソッドを呼ぶ
    // ※この時渡すコメントIDはnullで良い
    // 第２引数には「名前：値,・・・」のオブジェクト形式で渡す
    // ミューテーションに渡す引数のことを「ペイロード」という
    this.$store.commit("addComment", {
      comment: new Comment(
        -1,
        this.commentName,
        this.commentContent,
        articleId
      ),
    });
    // 入力値をフォームからクリアする
    this.commentName = "";
    this.commentContent = "";
  }
}
</script>
