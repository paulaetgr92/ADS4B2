
-- name: CreateLogin :one
INSERT INTO cadastro (email, password)
VALUES ($1, $2)
RETURNING *;


-- name: GetLogin :one
SELECT email, password
FROM cadastro
WHERE email = $1;
