'use client'

import { DiscussionEmbed } from 'disqus-react'

interface DisqusCommentsProps {
  identifier: string
  title: string
  url: string
}

export default function DisqusComments({ identifier, title, url }: DisqusCommentsProps) {
  const disqusShortname = process.env.NEXT_PUBLIC_DISQUS_SHORTNAME || ''

  if (!disqusShortname) {
    return null
  }

  const disqusConfig = {
    url,
    identifier,
    title,
  }

  return (
    <div className="mt-12 pt-8 border-t border-gray-200">
      <DiscussionEmbed shortname={disqusShortname} config={disqusConfig} />
    </div>
  )
}