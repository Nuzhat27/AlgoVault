// backend/seed.js

require("dotenv").config();
const mongoose = require("mongoose");

const User = require("./models/User");
const Problem = require("./models/Problem");
const Pattern = require("./models/Pattern");
const MockSession = require("./models/MockSession");

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("❌ MONGO_URI is missing from .env");
  process.exit(1);
}

const SEED_EMAIL =
  process.env.SEED_EMAIL || "nuzhatfrd@gmail.com";

/* =========================================================
   PATTERNS
========================================================= */

const patterns = [
  {
    name: "Two Pointers",
    description:
      "Use two indices moving through a data structure to solve problems efficiently.",
    category: "Arrays",
  },
  {
    name: "Sliding Window",
    description:
      "Maintain a dynamic window over an array or string to optimize subarray and substring problems.",
    category: "Arrays",
  },
  {
    name: "Hash Map",
    description:
      "Use hashing for constant-time lookup, frequency counting, and relationship tracking.",
    category: "Arrays",
  },
  {
    name: "Binary Search",
    description:
      "Reduce a sorted search space by half at every step.",
    category: "Searching",
  },
  {
    name: "Linked List",
    description:
      "Solve pointer manipulation, reversal, cycle detection, and merging problems.",
    category: "Linked List",
  },
  {
    name: "Trees",
    description:
      "Use DFS, BFS, recursion, and traversal techniques on hierarchical data.",
    category: "Trees",
  },
  {
    name: "Graphs",
    description:
      "Solve connectivity, traversal, shortest path, and dependency problems.",
    category: "Graphs",
  },
  {
    name: "Dynamic Programming",
    description:
      "Break problems into overlapping subproblems and store previously computed results.",
    category: "Dynamic Programming",
  },
];

/* =========================================================
   PROBLEMS
========================================================= */

const problems = [
  {
    title: "Two Sum",
    difficulty: "Easy",
    topic: "Hash Map",
    status: "Solved-Optimally",
    acceptance: 91,
  },
  {
    title: "Valid Anagram",
    difficulty: "Easy",
    topic: "Hash Map",
    status: "Solved",
    acceptance: 89,
  },
  {
    title: "Contains Duplicate",
    difficulty: "Easy",
    topic: "Hash Map",
    status: "Mastered",
    acceptance: 93,
  },
  {
    title: "Valid Palindrome",
    difficulty: "Easy",
    topic: "Two Pointers",
    status: "Solved",
    acceptance: 87,
  },
  {
    title: "Best Time to Buy and Sell Stock",
    difficulty: "Easy",
    topic: "Sliding Window",
    status: "Solved-Optimally",
    acceptance: 88,
  },
  {
    title: "Longest Substring Without Repeating Characters",
    difficulty: "Medium",
    topic: "Sliding Window",
    status: "Needs Revisit",
    acceptance: 76,
  },
  {
    title: "3Sum",
    difficulty: "Medium",
    topic: "Two Pointers",
    status: "Solved",
    acceptance: 72,
  },
  {
    title: "Container With Most Water",
    difficulty: "Medium",
    topic: "Two Pointers",
    status: "Solved",
    acceptance: 79,
  },
  {
    title: "Binary Search",
    difficulty: "Easy",
    topic: "Binary Search",
    status: "Mastered",
    acceptance: 94,
  },
  {
    title: "Search in Rotated Sorted Array",
    difficulty: "Medium",
    topic: "Binary Search",
    status: "Attempted",
    acceptance: 68,
  },
  {
    title: "Find Minimum in Rotated Sorted Array",
    difficulty: "Medium",
    topic: "Binary Search",
    status: "Solved",
    acceptance: 71,
  },
  {
    title: "Reverse Linked List",
    difficulty: "Easy",
    topic: "Linked List",
    status: "Mastered",
    acceptance: 92,
  },
  {
    title: "Merge Two Sorted Lists",
    difficulty: "Easy",
    topic: "Linked List",
    status: "Solved-Optimally",
    acceptance: 90,
  },
  {
    title: "Linked List Cycle",
    difficulty: "Easy",
    topic: "Linked List",
    status: "Solved",
    acceptance: 86,
  },
  {
    title: "Remove Nth Node From End of List",
    difficulty: "Medium",
    topic: "Linked List",
    status: "Needs Revisit",
    acceptance: 74,
  },
  {
    title: "Maximum Depth of Binary Tree",
    difficulty: "Easy",
    topic: "Trees",
    status: "Solved",
    acceptance: 91,
  },
  {
    title: "Invert Binary Tree",
    difficulty: "Easy",
    topic: "Trees",
    status: "Mastered",
    acceptance: 94,
  },
  {
    title: "Binary Tree Level Order Traversal",
    difficulty: "Medium",
    topic: "Trees",
    status: "Solved-Optimally",
    acceptance: 82,
  },
  {
    title: "Validate Binary Search Tree",
    difficulty: "Medium",
    topic: "Trees",
    status: "Attempted",
    acceptance: 69,
  },
  {
    title: "Lowest Common Ancestor of a BST",
    difficulty: "Medium",
    topic: "Trees",
    status: "Solved",
    acceptance: 79,
  },
  {
    title: "Number of Islands",
    difficulty: "Medium",
    topic: "Graphs",
    status: "Solved-Optimally",
    acceptance: 78,
  },
  {
    title: "Clone Graph",
    difficulty: "Medium",
    topic: "Graphs",
    status: "Attempted",
    acceptance: 65,
  },
  {
    title: "Course Schedule",
    difficulty: "Medium",
    topic: "Graphs",
    status: "Needs Revisit",
    acceptance: 61,
  },
  {
    title: "Graph Valid Tree",
    difficulty: "Medium",
    topic: "Graphs",
    status: "New",
    acceptance: 63,
  },
  {
    title: "Climbing Stairs",
    difficulty: "Easy",
    topic: "Dynamic Programming",
    status: "Mastered",
    acceptance: 95,
  },
  {
    title: "House Robber",
    difficulty: "Medium",
    topic: "Dynamic Programming",
    status: "Solved",
    acceptance: 83,
  },
  {
    title: "Coin Change",
    difficulty: "Medium",
    topic: "Dynamic Programming",
    status: "Needs Revisit",
    acceptance: 69,
  },
  {
    title: "Longest Increasing Subsequence",
    difficulty: "Medium",
    topic: "Dynamic Programming",
    status: "Attempted",
    acceptance: 58,
  },
  {
    title: "Maximum Subarray",
    difficulty: "Medium",
    topic: "Dynamic Programming",
    status: "Solved-Optimally",
    acceptance: 84,
  },
  {
    title: "Word Break",
    difficulty: "Medium",
    topic: "Dynamic Programming",
    status: "New",
    acceptance: 57,
  },
];

/* =========================================================
   MOCK INTERVIEWS
========================================================= */

const mockSessions = [
  {
    title: "Frontend Developer",
    role: "Frontend Developer",
    score: 850,
    totalScore: 1000,
    rating: "Excellent",
    duration: 45,
  },
  {
    title: "Backend Developer",
    role: "Backend Developer",
    score: 760,
    totalScore: 1000,
    rating: "Good",
    duration: 50,
  },
  {
    title: "SDE Intern",
    role: "SDE Intern",
    score: 680,
    totalScore: 1000,
    rating: "Good",
    duration: 35,
  },
];

/* =========================================================
   HELPERS
========================================================= */

function getDateDaysAgo(days) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
}

/* =========================================================
   SEED
========================================================= */

async function seed() {
  try {
    console.log("Connecting to MongoDB...");

    await mongoose.connect(MONGO_URI);

    console.log("✓ MongoDB connected");

    /* -----------------------------------------------------
       USER
    ----------------------------------------------------- */

    let user = await User.findOne({
      email: SEED_EMAIL.toLowerCase(),
    });

    if (!user) {
      user = await User.findOne();

      if (!user) {
        console.error("\n❌ No user found in the database.");
        console.error(
          "Create an account first, then run seed.js again."
        );

        await mongoose.disconnect();
        process.exit(1);
      }

      console.log(`Using existing user: ${user.email}`);
    } else {
      console.log(`Using seed user: ${user.email}`);
    }

    /* -----------------------------------------------------
       PATTERNS
    ----------------------------------------------------- */

    const patternDocuments = [];

    for (const pattern of patterns) {
      let existing = await Pattern.findOne({
        name: pattern.name,
        user: user._id,
      });

      if (!existing) {
        existing = await Pattern.create({
          ...pattern,
          user: user._id,
        });

        console.log(`✓ Pattern created: ${pattern.name}`);
      } else {
        console.log(`↪ Pattern exists: ${pattern.name}`);
      }

      patternDocuments.push(existing);
    }

    /* -----------------------------------------------------
       PROBLEMS
    ----------------------------------------------------- */

    let createdProblems = 0;
    const problemDocuments = [];

    for (const problem of problems) {
      let existing = await Problem.findOne({
        title: problem.title,
        user: user._id,
      });

      if (!existing) {
        existing = await Problem.create({
          ...problem,
          user: user._id,

          solvedAt:
            problem.status === "Solved" ||
            problem.status === "Solved-Optimally" ||
            problem.status === "Mastered"
              ? getDateDaysAgo(
                  Math.floor(Math.random() * 30)
                )
              : null,
        });

        createdProblems++;

        console.log(`✓ Problem created: ${problem.title}`);
      } else {
        console.log(`↪ Problem exists: ${problem.title}`);
      }

      problemDocuments.push(existing);
    }

    /* -----------------------------------------------------
       MOCK INTERVIEWS
    ----------------------------------------------------- */

    let createdInterviews = 0;

    for (const interview of mockSessions) {
      const existing = await MockSession.findOne({
        user: user._id,
        role: interview.role,
      });

      if (existing) {
        console.log(
          `↪ Mock interview exists: ${interview.role}`
        );
        continue;
      }

      const interviewDate = getDateDaysAgo(
        Math.floor(Math.random() * 20)
      );

      await MockSession.create({
        ...interview,
        user: user._id,

        // Required by MockSession schema
        date: interviewDate,

        // Keep completedAt as well if your schema supports it
        completedAt: interviewDate,
      });

      createdInterviews++;

      console.log(
        `✓ Mock interview created: ${interview.role}`
      );
    }

    /* -----------------------------------------------------
       SUMMARY
    ----------------------------------------------------- */

    const totalProblems = await Problem.countDocuments({
      user: user._id,
    });

    const totalPatterns = await Pattern.countDocuments({
      user: user._id,
    });

    const totalInterviews = await MockSession.countDocuments({
      user: user._id,
    });

    console.log("\n================================");
    console.log("       ALGOFLOW SEED COMPLETE");
    console.log("================================");

    console.log(`User:             ${user.email}`);
    console.log(`Patterns:         ${totalPatterns}`);
    console.log(`Problems:         ${totalProblems}`);
    console.log(`New problems:     ${createdProblems}`);
    console.log(`Mock interviews:  ${totalInterviews}`);
    console.log(`New interviews:   ${createdInterviews}`);

    console.log("================================\n");

    await mongoose.disconnect();

    console.log("✓ MongoDB disconnected");

    process.exit(0);
  } catch (error) {
    console.error("\n❌ SEED FAILED\n");
    console.error(error);

    try {
      await mongoose.disconnect();
    } catch (disconnectError) {
      console.error("MongoDB disconnect failed:", disconnectError);
    }

    process.exit(1);
  }
}

seed();