import { GraphQLClient, gql } from 'graphql-request';

const client = new GraphQLClient(process.env.ANILIST_API_URL ?? 'https://graphql.anilist.co');

export const ANIME_FIELDS = gql`
  fragment AnimeFields on Media {
    id
    title { romaji english native }
    description(asHtml: false)
    coverImage { extraLarge large }
    bannerImage
    genres
    meanScore
    episodes
    status
    season
    seasonYear
  }
`;

export const GET_ANIME = gql`
  ${ANIME_FIELDS}
  query GetAnime($id: Int!) {
    Media(id: $id, type: ANIME) { ...AnimeFields }
  }
`;

export const SEARCH_ANIMES = gql`
  ${ANIME_FIELDS}
  query SearchAnimes($search: String, $page: Int, $perPage: Int) {
    Page(page: $page, perPage: $perPage) {
      pageInfo { total currentPage lastPage hasNextPage }
      media(search: $search, type: ANIME, sort: POPULARITY_DESC) { ...AnimeFields }
    }
  }
`;

export const GET_TOP_ANIMES = gql`
  ${ANIME_FIELDS}
  query GetTopAnimes($page: Int, $perPage: Int) {
    Page(page: $page, perPage: $perPage) {
      media(type: ANIME, sort: POPULARITY_DESC) { ...AnimeFields }
    }
  }
`;

export { client as anilistClient };
