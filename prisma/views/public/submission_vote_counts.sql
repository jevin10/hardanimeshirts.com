SELECT
  s.submission_id,
  s.title,
  s.image_url,
  s.created_at,
  s.category,
  u.username,
  COALESCE(sum(v.vote_type), (0) :: bigint) AS vote_count,
  count(
    CASE
      WHEN (v.vote_type = 1) THEN 1
      ELSE NULL :: integer
    END
  ) AS upvotes,
  count(
    CASE
      WHEN (v.vote_type = '-1' :: integer) THEN 1
      ELSE NULL :: integer
    END
  ) AS downvotes
FROM
  (
    (
      event_submissions s
      JOIN "User" u ON ((s.username = u.username))
    )
    LEFT JOIN votes v ON ((s.submission_id = v.submission_id))
  )
GROUP BY
  s.submission_id,
  s.title,
  s.image_url,
  s.created_at,
  s.category,
  u.username;