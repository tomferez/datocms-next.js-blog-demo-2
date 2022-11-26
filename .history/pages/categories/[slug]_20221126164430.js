import Head from "next/head";
import { renderMetaTags, useQuerySubscription } from "react-datocms";
import Container from "@/components/container";
import Header from "@/components/header";
import Layout from "@/components/layout";
import MoreStories from "@/components/more-stories";
import PostBody from "@/components/post-body";
import PostHeader from "@/components/post-header";
import SectionSeparator from "@/components/section-separator";
import { request } from "@/lib/datocms";
import { metaTagsFragment, responsiveImageFragment } from "@/lib/fragments";

export async function getStaticPaths() {
  const data = await request({ query: `{ allCategories { slug } }` });

  return {
    paths: data.allCategories.map((category) => `/categories/${category.slug}`),
    fallback: false,
  };
}

export async function getStaticProps({ params, preview = false }) {
  const graphqlRequest = {
    query: `
      query PostsByCategory($eq: ItemId = $id) {
        site: _site {
          favicon: faviconMetaTags {
            ...metaTagsFragment
          }
        }

        allPosts(filter: {category: {eq: $eq}}) {
          id
          title
          slug
          updatedAt
          date
          coverImage {
            alt
            title
            url
          }
        }

        category {
          name
          slug
          id
        }
      }
    
      ${responsiveImageFragment}
      ${metaTagsFragment}
    `,
    preview,
    variables: {
      id: params.id,
    },
  };

  return {
    props: {
      subscription: preview
        ? {
            ...graphqlRequest,
            initialData: await request(graphqlRequest),
            token: process.env.NEXT_EXAMPLE_CMS_DATOCMS_API_TOKEN,
          }
        : {
            enabled: false,
            initialData: await request(graphqlRequest),
          },
      preview,
    },
  };
}

export default function Post({ subscription, preview }) {
  const {
    data: { allPosts, site, category },
  } = useQuerySubscription(subscription);

  const metaTags = category.seo.concat(site.favicon);

  return (
    <Layout preview={preview}>
      <Head>{renderMetaTags(metaTags)}</Head>
      <Container>
        <Header />
        <article>
          <PostHeader
            title={category.title}
            coverImage={category.coverImage}
            date={category.date}
            author={category.author}
          />
          <PostBody content={post.content} />
        </article>
      </Container>
    </Layout>
  );
}
