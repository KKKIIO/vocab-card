import React from "react"
import { GetStaticProps } from "next"
import Layout from "../components/Layout"
import UnfamiliarWord, { UnfamiliarWordProps } from "../components/UnfamiliarWord"
import prisma from "../lib/prisma"
import { UnfamiliarStatus } from "@prisma/client"

export const getStaticProps: GetStaticProps = async () => {
  const unfamiliarWords = await prisma.unfamiliarWord.findMany({
    where: { status: UnfamiliarStatus.Learning },
    include: {
      word: {
        select: { text: true }
      },
    },
    orderBy: [{ createdAt: "desc" }]
  })

  return {
    props: {
      unfamiliarWords: unfamiliarWords.map((unfamiliarWord) => ({
        ...unfamiliarWord,
        createdAt: unfamiliarWord.createdAt.toISOString(),
        updatedAt: unfamiliarWord.updatedAt.toISOString(),
      }))
    },
    revalidate: 10
  }
}

type Props = {
  unfamiliarWords: UnfamiliarWordProps[]
}

const Blog: React.FC<Props> = (props) => {
  return (
    <Layout>
      <div className="page">
        <h1>Unfamiliar Words</h1>
        <main>
          {props.unfamiliarWords.map((unfamiliarWord) => (
            <div key={unfamiliarWord.id} className="post">
              <UnfamiliarWord unfamiliarWord={unfamiliarWord} />
            </div>
          ))}
        </main>
      </div>
      <style jsx>{`
        .post {
          background: white;
          transition: box-shadow 0.1s ease-in;
        }

        .post:hover {
          box-shadow: 1px 1px 3px #aaa;
        }

        .post + .post {
          margin-top: 2rem;
        }
      `}</style>
    </Layout>
  )
}

export default Blog
