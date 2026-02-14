-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Place" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "rating" REAL NOT NULL,
    "reviewCount" INTEGER NOT NULL,
    "distance" REAL NOT NULL,
    "image" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "mapUrl" TEXT,
    "isSaved" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Place" ("category", "city", "createdAt", "description", "distance", "id", "image", "mapUrl", "name", "rating", "reviewCount") SELECT "category", "city", "createdAt", "description", "distance", "id", "image", "mapUrl", "name", "rating", "reviewCount" FROM "Place";
DROP TABLE "Place";
ALTER TABLE "new_Place" RENAME TO "Place";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
