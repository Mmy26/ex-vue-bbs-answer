import { Article } from "@/types/article";
import { Comment } from "@/types/comment";
import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  strict: true,
  state: {
    articles: [
      new Article(3, "佐藤", "佐藤さんの記事", []),
      new Article(2, "山田", "山田さんの記事", [
        new Comment(13, "山崎", "山崎さんのコメント", 2),
      ]),
      new Article(1, "伊藤", "伊藤さんの記事", [
        new Comment(12, "鈴木", "鈴木さんのコメント", 1),
        new Comment(11, "吉田", "吉田さんのコメント", 1),
      ]),
    ],
  }, // end state
  actions: {}, // end actions
  mutations: {
    /**
     * 記事を追加する.
     * @param state - ステート
     * @param payload 記事情報
     */
    addArticle(state, payload) {
      // 最新の記事IDに１プラスする形で記事IDを作成する
      let newArticleId = 0;
      // もし記事が１件でもあれば最後の記事IDに1を足したものをIDとする
      if (state.articles.length > 0) {
        newArticleId = state.articles[0].id + 1;
      }
      // payloadで渡ってきたArticleオブジェクトの-1になっているIDを新しいIDで上書き
      payload.article.id = newArticleId;

      // 受け取ったpayload内のarticleをstateのarticlesの0番目に追加する
      state.articles.unshift(payload.article);

      // 新しい投稿が一番上に来るようにidで並び替え(今回は０番目に入れているので必要なし)
      // state.articles.sort(function(boforeArticle, afterArticle) {
      //   return afterArticle.id - boforeArticle.id;
      // });
    },
    /**
     * コメントを追加する.
     *
     * @remarks 渡されたPayload中のaritcleIdから対象の記事を見つけ、その中のCommentListにコメントを追加します
     * @param state - ステート
     * @param payload - コメント情報
     */
    addComment(state, payload) {
      // 渡されたpayload中のaritcleIdから追加対象の記事を検索する
      const article = state.articles.find(
        (article) => article.id === payload.comment.articleId
      );
      if (article) {
        // 記事が存在していたら最新のコメントIDに１プラスする形でコメントIDを作成する
        let newCommentId = 0;
        // もしコメントが１件でもあれば最後のコメントIDに1を足したものをIDとする
        if (article.commentList.length > 0) {
          newCommentId = article.commentList[0].id + 1;
        }
        // payloadで渡ってきたCommentオブジェクトの-1になっているIDを新しいIDで上書き
        payload.comment.id = newCommentId;

        //CommentListにコメントを追加
        article.commentList.unshift(payload.comment);
      }
    },
    /**
     * 記事を削除する.
     *
     * @param state - ステート
     * @param payload 記事Index
     */
    deleteArticle(state, payload) {
      // 添字1(第1引数)から1つ(第２引数)を削除
      state.articles.splice(payload.articleIndex, 1);
    },
  }, // end mutations
  getters: {
    /**
     * 記事一覧を返す.
     *
     * @param state -  ステート
     * @returns 記事一覧情報 (新しい投稿が上に来る順序)
     */
    getArticles(state) {
      return state.articles;
    },
  }, // end getters
  modules: {}, // end modules
});
