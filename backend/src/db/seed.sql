BEGIN;

WITH USERS AS (
	INSERT INTO public.user (name, password)
	VALUES ('username','password')
	RETURNING "userId" AS genUserId
), TEAMS AS (
    INSERT INTO public.team (name, "userIdUserId") 
    SELECT 'teamName', genUserId FROM USERS 
    RETURNING "teamId" AS genTeamId 
)
INSERT INTO public.player (name, "jerseyNum", "teamIdTeamId")
SELECT 'playerName', 5, genTeamId FROM TEAMS;

INSERT INTO public.user (name, username, password) VALUES ('test', 'test', '$2b$10$MRCZRg5j8N6ffZiQwl8U5ORIIDoKqSyQ11Iej8w5OmJQ3Wl0woxfC') ON CONFLICT DO NOTHING;
COMMIT;