---
title: What I learned building my first full-stack app
date: 2026-05-18
category: build
tags: [Web dev, Lessons]
summary: From data modeling to deployment — the decisions I would make differently next time.
---

My first full-stack project was a study planner. It worked, but I rewrote large parts of it twice. Here is what I would do differently.

## Start from the data, not the screens

I began with mockups and discovered the database shape too late. Sketching the tables first would have saved a migration.

```sql
CREATE TABLE tasks (
  id        INTEGER PRIMARY KEY,
  title     TEXT NOT NULL,
  due_date  DATE,
  done      BOOLEAN DEFAULT FALSE
);
```

## Keep the API boring

Plain JSON, predictable names, honest status codes. Clever endpoints cost more to explain than they save.

## Deploy on day one

A deployed "hello world" exposes environment and configuration problems while they are still cheap. I left deployment to the end, and it took longer than the feature work.

## What I would keep

- Small commits with clear messages
- A README written *before* the code
- Asking for feedback from one real user early
