import Head from "next/head";
import { renderMetaTags, useQuerySubscription } from "react-datocms";
import Container from "@/components/container";
import Header from "@/components/header";
import Layout from "@/components/layout";
import PostBody from "@/components/post-body";
import PostHeader from "@/components/post-header";
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

        allPosts(filter: {category: {eq: $id}}) {
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

        category ({filter: {slug: {eq: $slug}})
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
      id: "123",
      slug: params.slug
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
    data: { site, allPosts, category},
  } = useQuerySubscription(subscription);

  const metaTags = post.seo.concat(site.favicon);

  return (
   <div>hello</div>
  );
}
