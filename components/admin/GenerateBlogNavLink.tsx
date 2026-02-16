import React from 'react'

const GenerateBlogNavLink: React.FC = () => {
  return (
    <a
      href="/admin/generate-blog"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '6px 16px',
        color: 'var(--theme-elevation-800, inherit)',
        textDecoration: 'none',
        fontSize: '13px',
        borderRadius: '4px',
        transition: 'background-color 0.15s',
        margin: '2px 12px',
      }}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
      </svg>
      Generate Blog Post
    </a>
  )
}

export default GenerateBlogNavLink
