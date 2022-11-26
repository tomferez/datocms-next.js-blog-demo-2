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
      query PostsByCategory {

        allPosts {
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

export default function Category({ subscription, preview }) {
  const {
    data: { allPosts },
  } = useQuerySubscription(subscription);

  return (
    <> 
      <div>hello</div>
    </>
  );
}
