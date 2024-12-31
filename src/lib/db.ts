"use client";

import Dexie, { type Table } from "dexie";
import { ResumeType } from "@/hooks/use-ajax-resumes";
import dayjs from "dayjs";

type Session = ResumeType;

class SessionDatabase extends Dexie {
  sessions!: Table<Session>;

  constructor() {
    super("ResumeSessions");
    this.version(2).stores({
      sessions:
        "++id, title, coverUrl, slug, data, visibility, locked, userId, user, createdAt, updatedAt",
    });
  }
}

const db = new SessionDatabase();

export const save = async (session: Session) => {
  await db.sessions.add({
    ...session,
    id: session.id || Date.now().toString(),
    createdAt: session.createdAt || Date.now().toString(),
  });
};

export const update = async (session: Session) => {
  await db.sessions.update(session.id, {
    ...session,
    updatedAt: Date.now().toString(),
  });
};

export const getAll = async () => {
  const sessions = await db.sessions.toArray();
  sessions.sort(
    (prev, next) => Number(next.updatedAt) - Number(prev.updatedAt)
  );
  return sessions;
};

export const remove = async (id: string) => {
  await db.sessions.delete(id);
};

export const getById = async (id: string) => {
  const session = await db.sessions.get(id);
  return session;
};
