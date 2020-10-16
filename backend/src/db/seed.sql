BEGIN;

WITH USERS AS (
	INSERT INTO public.user (name)
	VALUES ('username')
	RETURNING "userId" AS genUserId
), TEAMS AS (
    INSERT INTO public.team (name, "userIdUserId") 
    SELECT 'teamName', genUserId FROM USERS 
    RETURNING "teamId" AS genTeamId 
)
INSERT INTO public.player (name, "jerseyNum", "teamIdTeamId")
SELECT 'playerName', 5, genTeamId FROM TEAMS;

COMMIT;