# TODO
- Setup Node + Express + JS - Done!
- Setup DB - Done!
- Connect DB to Node - Done!
  - Clean up db layer - Done!
  - Manually populate db tables with data - Done!
  - GET /tasks - Done!
  - GET /board:id
  - POST /tasks
- Features
  - Users - Create - Done!
    - Create board for that user
  - Auth - Login
  - Tasks
    - Get all tasks from user - Done!
	- Create - 80%
	- Move - 80%
	- Update - Done!
	- Delete - Done!
- Setup dev env
- Initial coding of `Tasks` endpoints
- Auth - Register + Login

Nice-to-haves
- Create Docker so they can run anywhere

Let's review what they said about the requirements but supposedly it's the bare minimum, and this is just for coding assessment. Let's just give the DB Schemas in the form SQL queries so it can be recreated.

# Requirements
Setup a project with your programming language of choice and create an API for managing a TODO list with the following specification:

Register

The user should be able to register with a username and password - Done!

Usernames must be unique across all users - Done!

Login

The user should be able to log in with the credentials they provided in the register endpoint

Should return an access token that can be used for the other endpoints

The user should only be able to access their own tasks - Authorization

The user should be able to list all tasks in the TODO list - GET List

The user should be able to add a task to the TODO list - POST

The user should be able to update the details of a task in their TODO list - PUT

The user should be able to remove a task from the TODO list - DELETE

The user should be able to reorder the tasks in the TODO list - POST (you have to change order of the other tasks, should have an `order` table instead of using `cards` table to order)

A task in the TODO list should be able to handle being moved more than 50 times

A task in the TODO list should be able to handle being moved to more than one task away from its current position


# Thoughts
**Note: You can think of this as an API endpoint that will be used to handle the drag and drop feature of a TODO list application.** I'm assuming the board just shows you the card name and you'll have to click on a card to show more details.

Users, Tasks, Lists. Create a jsonb for lists. Lists should only contain the fields for cardView: `{ id: string, name: string }`. When re-arranging cards, they'll call and endpoint that excepts a JSON of board wherein it's just an array of cardIds. You can't change name when changing order so there's this intentional disjoint. `GET /board:id` should return you an array with `id` and `name` but `PUT /board/:id` should only care about `id`.

For now, we're just going to assume that the UI app adhere to our designated behavior. It will send a `PUT /board/:id` request each time it moves a single card and that we trust that it will give us the proper `name`. Otherwise, we'll have to deal with lots of validation that could result in unoptimized performance, e.g. check whole list if only one moved, and check if every `name` matches every `id`.

1:1 User:List, 1:Many User:Tasks (can be foregone??), 1:Many Board:Tasks.

## Reordering tasks
Scenario:
1. User is shown their TODO list (board)
2. TODO list just shows task names
3. User will click on a certain task to see more details about it such as description, date, comments, and etc.
4. Users can re-order tasks when they're on the TODO list (board) view

Instead of our endpoint accepting an array of `{ id: string, name: string }` that will reflect our board, we'd rather have them send us `cardId` and to what `position` it want to be moved. We'll use this to change the *tasks* `jsonb` column in the `boards` db table. We'll use `boards` so the UI knows in which order the tasks should be displayed. The *tasks* column will only include `cardId`, `name` and other fields that we'll be showing on the board right away. This way, we don't need to validate the array our endpoint would be receiving, it's much simpler with just `cardId` and `position`. To add, reordering of priorities is important for users of todo list so this will have to be saved each time they changed orders.

### Why do we choose to use *tasks* column in board to determine order of tasks?
If we add *position* column in `tasks` db table, then it'd be a nightmare re-ordering a single card in a board with 50 tasks. Worst-case, you'll have to update 50 rows if you have to move a task to the top-most priority.

---
## DB Schema
`Users` - simple Auth should do but I'd really prefer to use an existing Auth service for actual security. Deferring use of encryption.
- id
- password
- name
- jwt_access_token

`Tasks`
- id
- name
- description
- board_id

`Boards` - Assume TODO List = Board
- id
- name
- description
- tasks - jsonb or json

Limitations - app code has to be stringent with how a `Board.tasks` is populated, it can't have `Tasks` which doesn't belong to that `Board` otherwise it will show up in the Board but if you click on that card to show more details, you'll encounter an authorization error.

### SQL Queries to regenerate DB Schemas
```sql
-- public.users definition

-- Drop table

-- DROP TABLE public.users;

CREATE TABLE public.users (
	id int4 NOT NULL GENERATED ALWAYS AS IDENTITY,
	"password" varchar NOT NULL,
	user_name varchar NULL,
	jwt_access_token varchar NULL,
	CONSTRAINT users_pk null,
	CONSTRAINT users_un UNIQUE (user_name)
);


-- public.boards definition

-- Drop table

-- DROP TABLE public.boards;

CREATE TABLE public.boards (
	id int4 NOT NULL GENERATED ALWAYS AS IDENTITY,
	"name" varchar NULL,
	description varchar NULL,
	tasks jsonb NULL,
	user_id int4 NOT NULL,
	CONSTRAINT boards_pk PRIMARY KEY (id),
	CONSTRAINT boards_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);


-- public.tasks definition

-- Drop table

-- DROP TABLE public.tasks;

CREATE TABLE public.tasks (
	id int4 NOT NULL GENERATED ALWAYS AS IDENTITY,
	"name" varchar NULL,
	description varchar NULL,
	board_id int4 NOT NULL,
	CONSTRAINT tasks_pk PRIMARY KEY (id),
	CONSTRAINT tasks_board_id_fkey FOREIGN KEY (board_id) REFERENCES public.boards(id)
);
```

# Scratch
Can use this to run with variables, just to make Postgres work. Make .env be used when you run:
```
PGUSER=postgres \
  PGHOST=localhost \
  PGPASSWORD=AwitSakit \
  PGDATABASE=postgres \
  PGPORT=5432 \
  node ./src/app.js
```