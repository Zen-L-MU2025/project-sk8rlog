-- CreateTable
CREATE TABLE "User" (
    "userID" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "joinDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "location" TEXT NOT NULL,
    "bio" TEXT NOT NULL,
    "profilePicUrl" TEXT NOT NULL,
    "following" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "favorites" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "likedPosts" TEXT[] DEFAULT ARRAY[]::TEXT[],

    CONSTRAINT "User_pkey" PRIMARY KEY ("userID")
);

-- CreateTable
CREATE TABLE "Post" (
    "postID" TEXT NOT NULL,
    "authorID" TEXT NOT NULL,
    "creationDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "description" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "likeCount" INTEGER NOT NULL DEFAULT 0,
    "comments" TEXT[] DEFAULT ARRAY[]::TEXT[],

    CONSTRAINT "Post_pkey" PRIMARY KEY ("postID")
);

-- CreateTable
CREATE TABLE "Comment" (
    "commentID" TEXT NOT NULL,
    "authorID" TEXT NOT NULL,
    "content" TEXT NOT NULL,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("commentID")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
