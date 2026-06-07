import React, { useEffect, useState } from 'react'
import CSS from './CommunityCard.module.css'

const AVATAR_PALETTE = ['#3bb77e', '#e0a32e', '#d2603a', '#3a7bd2', '#9457d6', '#2eb6c2']

const initialsOf = (name) => name.split(' ').filter(Boolean).slice(0, 2).map(w => w[0]).join('').toUpperCase()
const colorOf = (name) => AVATAR_PALETTE[name.charCodeAt(0) % AVATAR_PALETTE.length]

const Stars = ({ rating }) => (
  <span className={CSS['stars']} aria-label={`${rating} out of 5 stars`}>
    {[1, 2, 3, 4, 5].map(n => (
      <i key={n} className={`fa-solid fa-star ${n <= rating ? CSS['star-filled'] : CSS['star-empty']}`} />
    ))}
  </span>
)

function CommunityCard({ tag, title, subtitle, memberName, memberRole, memberImg, communityImg, stats, reviews }) {
  const [liked, setLiked] = useState(false)
  const [joined, setJoined] = useState(false)
  const [reviewIndex, setReviewIndex] = useState(0)
  const [fade, setFade] = useState(true)

  const baseLikes = 1000 + (title.length * 37) % 900
  const likeCount = baseLikes + (liked ? 1 : 0)
  const memberCount = (joined ? Number(stats.members.replace(/,/g, '')) + 1 : Number(stats.members.replace(/,/g, ''))).toLocaleString()

  useEffect(() => {
    const timer = setInterval(() => {
      setFade(false)
      setTimeout(() => {
        setReviewIndex(i => (i + 1) % reviews.length)
        setFade(true)
      }, 350)
    }, 4500)
    return () => clearInterval(timer)
  }, [reviews.length])

  const goToReview = (i) => {
    if (i === reviewIndex) return
    setFade(false)
    setTimeout(() => {
      setReviewIndex(i)
      setFade(true)
    }, 350)
  }

  const review = reviews[reviewIndex]

  return (
    <div className={CSS['wrapper-grid']}>
      <div className={CSS['card-container']}>

        <div className={CSS['card-img']}>
          <img className={CSS['img']} src={communityImg} alt={title} />
          <span className={CSS['tag-badge']}>{tag}</span>
          <button
            className={`${CSS['like-btn']} ${liked ? CSS['like-btn-active'] : ''}`}
            onClick={() => setLiked(l => !l)}
            aria-pressed={liked}
            title={liked ? 'Unlike' : 'Like this community'}
          >
            <i className={`${liked ? 'fa-solid' : 'fa-regular'} fa-heart`} />
            <span>{likeCount.toLocaleString()}</span>
          </button>
        </div>

        <div className={CSS['card-data-container']}>
          <h2 className={CSS['card-title']}>{title}</h2>
          <p className={CSS['card-subtitle']}>{subtitle}</p>

          <div className={CSS['stat-row']}>
            <span><i className="fa-solid fa-users" /> {memberCount} members</span>
            <span><i className="fa-solid fa-comments" /> {stats.posts} posts/week</span>
          </div>

          <div className={CSS['card-user']}>
            <img className={CSS['card-user-img']} src={memberImg} alt={memberName} />
            <div>
              <p className={CSS['card-user-name']}>{memberName}</p>
              <p className={CSS['card-user-role']}>{memberRole}</p>
            </div>
          </div>

          <div className={CSS['review-box']}>
            <div className={`${CSS['review-content']} ${fade ? CSS['review-visible'] : ''}`}>
              <div className={CSS['review-head']}>
                <span className={CSS['review-avatar']} style={{ background: colorOf(review.name) }}>
                  {initialsOf(review.name)}
                </span>
                <div>
                  <p className={CSS['review-name']}>{review.name} <span className={CSS['review-city']}>· {review.city}</span></p>
                  <Stars rating={review.rating} />
                </div>
              </div>
              <p className={CSS['review-text']}>&ldquo;{review.text}&rdquo;</p>
            </div>
            <div className={CSS['review-dots']}>
              {reviews.map((_, i) => (
                <button
                  key={i}
                  className={`${CSS['dot']} ${i === reviewIndex ? CSS['dot-active'] : ''}`}
                  onClick={() => goToReview(i)}
                  aria-label={`Show review ${i + 1}`}
                />
              ))}
            </div>
          </div>

          <button
            className={`${CSS['join-btn']} ${joined ? CSS['join-btn-active'] : ''}`}
            onClick={() => setJoined(j => !j)}
          >
            <i className={`fa-solid ${joined ? 'fa-circle-check' : 'fa-user-plus'}`} />
            {joined ? 'Joined' : 'Join Community'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default CommunityCard
