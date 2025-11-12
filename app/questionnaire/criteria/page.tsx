"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";

// Criteria data based on TSV
const criteriaData = [
  {
    id: 1,
    title: "Ethics in AI",
    totalScore: 2000,
    questions: [
      {
        id: "1.1",
        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua?",
        type: "radio",
        options: [
          { label: "Lorem ipsum dolor sit amet", value: 0 },
          { label: "Lorem ipsum dolor sit amet", value: 25 },
          { label: "Lorem ipsum dolor sit amet", value: 50 },
          { label: "Lorem ipsum dolor sit amet", value: 75 },
          { label: "Lorem ipsum dolor sit amet", value: 100 },
        ],
        score: 200,
      },
      {
        id: "1.2",
        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua?",
        type: "radio",
        options: [
          { label: "Lorem ipsum dolor sit amet", value: 0 },
          { label: "Lorem ipsum dolor sit amet", value: 25 },
          { label: "Lorem ipsum dolor sit amet", value: 50 },
          { label: "Lorem ipsum dolor sit amet", value: 75 },
          { label: "Lorem ipsum dolor sit amet", value: 100 },
        ],
        score: 150,
      },
    ],
  },
  {
    id: 2,
    title: "Fairness",
    totalScore: 1200,
    questions: [
      {
        id: "2.1",
        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua?",
        type: "likert",
        score: 200,
      },
      {
        id: "2.2",
        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua?",
        type: "likert",
        score: 150,
      },
    ],
  },
  {
    id: 3,
    title: "Transparency",
    totalScore: 1300,
    questions: [
      {
        id: "3.1",
        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua?",
        type: "radio",
        options: [
          { label: "Lorem ipsum dolor sit amet", value: 0 },
          { label: "Lorem ipsum dolor sit amet", value: 25 },
          { label: "Lorem ipsum dolor sit amet", value: 50 },
          { label: "Lorem ipsum dolor sit amet", value: 75 },
          { label: "Lorem ipsum dolor sit amet", value: 100 },
        ],
        score: 200,
      },
      {
        id: "3.2",
        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua?",
        type: "likert",
        score: 200,
      },
    ],
  },
  {
    id: 4,
    title: "Accountability",
    totalScore: 1200,
    questions: [
      {
        id: "4.1",
        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua?",
        type: "likert",
        score: 200,
      },
      {
        id: "4.2",
        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua?",
        type: "radio",
        options: [
          { label: "Lorem ipsum dolor sit amet", value: 0 },
          { label: "Lorem ipsum dolor sit amet", value: 25 },
          { label: "Lorem ipsum dolor sit amet", value: 50 },
          { label: "Lorem ipsum dolor sit amet", value: 75 },
          { label: "Lorem ipsum dolor sit amet", value: 100 },
        ],
        score: 200,
      },
    ],
  },
  {
    id: 5,
    title: "Privacy",
    totalScore: 1000,
    questions: [
      {
        id: "5.1",
        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua?",
        type: "radio",
        options: [
          { label: "Lorem ipsum dolor sit amet", value: 0 },
          { label: "Lorem ipsum dolor sit amet", value: 25 },
          { label: "Lorem ipsum dolor sit amet", value: 50 },
          { label: "Lorem ipsum dolor sit amet", value: 75 },
          { label: "Lorem ipsum dolor sit amet", value: 100 },
        ],
        score: 200,
      },
      {
        id: "5.2",
        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua?",
        type: "likert",
        score: 150,
      },
    ],
  },
  {
    id: 6,
    title: "Security",
    totalScore: 1100,
    questions: [
      {
        id: "6.1",
        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua?",
        type: "likert",
        score: 200,
      },
      {
        id: "6.2",
        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua?",
        type: "radio",
        options: [
          { label: "Lorem ipsum dolor sit amet", value: 0 },
          { label: "Lorem ipsum dolor sit amet", value: 25 },
          { label: "Lorem ipsum dolor sit amet", value: 50 },
          { label: "Lorem ipsum dolor sit amet", value: 75 },
          { label: "Lorem ipsum dolor sit amet", value: 100 },
        ],
        score: 150,
      },
    ],
  },
  {
    id: 7,
    title: "Continuous Learning",
    totalScore: 1000,
    questions: [
      {
        id: "7.1",
        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua?",
        type: "radio",
        options: [
          { label: "Lorem ipsum dolor sit amet", value: 0 },
          { label: "Lorem ipsum dolor sit amet", value: 25 },
          { label: "Lorem ipsum dolor sit amet", value: 50 },
          { label: "Lorem ipsum dolor sit amet", value: 75 },
          { label: "Lorem ipsum dolor sit amet", value: 100 },
        ],
        score: 200,
      },
      {
        id: "7.2",
        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua?",
        type: "likert",
        score: 200,
      },
    ],
  },
  {
    id: 8,
    title: "Collaboration",
    totalScore: 900,
    questions: [
      {
        id: "8.1",
        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua?",
        type: "likert",
        score: 150,
      },
      {
        id: "8.2",
        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua?",
        type: "radio",
        options: [
          { label: "Lorem ipsum dolor sit amet", value: 0 },
          { label: "Lorem ipsum dolor sit amet", value: 25 },
          { label: "Lorem ipsum dolor sit amet", value: 50 },
          { label: "Lorem ipsum dolor sit amet", value: 75 },
          { label: "Lorem ipsum dolor sit amet", value: 100 },
        ],
        score: 200,
      },
    ],
  },
];

interface Answer {
  [key: string]: {
    value: number;
    evidence?: string;
  };
}

export default function CriteriaPage() {
  const router = useRouter();
  const [currentCriteria, setCurrentCriteria] = useState(1);
  const [answers, setAnswers] = useState<Answer>({});
  const [institutionName, setInstitutionName] = useState("Example University");
  const [currentUserEmail, setCurrentUserEmail] = useState("");

  useEffect(() => {
    // Get current user email
    const userEmail = localStorage.getItem("userEmail");
    if (!userEmail) {
      // If no user logged in, redirect to login
      router.push("/login");
      return;
    }
    setCurrentUserEmail(userEmail);

    // Load general info for this user
    const generalInfoKey = `generalInfo_${userEmail}`;
    const generalInfo = localStorage.getItem(generalInfoKey);
    if (generalInfo) {
      const data = JSON.parse(generalInfo);
      setInstitutionName(data.institutionName || "Example University");
    }

    // Load questionnaire answers for this user
    const answersKey = `questionnaireAnswers_${userEmail}`;
    const savedAnswers = localStorage.getItem(answersKey);
    if (savedAnswers) {
      setAnswers(JSON.parse(savedAnswers));
    }
  }, [router]);

  const currentCriteriaData = criteriaData.find(
    (c) => c.id === currentCriteria
  )!;

  const calculateProgress = () => {
    const totalQuestions = criteriaData.reduce(
      (sum, criteria) => sum + criteria.questions.length,
      0
    );
    const answeredQuestions = Object.keys(answers).length;
    return Math.round((answeredQuestions / totalQuestions) * 100);
  };

  const calculateScore = () => {
    let totalScore = 0;
    criteriaData.forEach((criteria) => {
      criteria.questions.forEach((question) => {
        const answer = answers[question.id];
        if (answer) {
          totalScore += (question.score * answer.value) / 100;
        }
      });
    });
    return Math.round(totalScore);
  };

  const handleAnswer = (questionId: string, value: number) => {
    const newAnswers = {
      ...answers,
      [questionId]: {
        ...answers[questionId],
        value,
      },
    };
    setAnswers(newAnswers);
    // Save with user-specific key
    const answersKey = `questionnaireAnswers_${currentUserEmail}`;
    localStorage.setItem(answersKey, JSON.stringify(newAnswers));
  };

  const handleNext = () => {
    if (currentCriteria < 8) {
      setCurrentCriteria(currentCriteria + 1);
    } else {
      router.push("/questionnaire/review");
    }
  };

  const handleBack = () => {
    if (currentCriteria > 1) {
      setCurrentCriteria(currentCriteria - 1);
    }
  };

  const isCriteriaCompleted = (criteriaId: number) => {
    const criteria = criteriaData.find((c) => c.id === criteriaId);
    if (!criteria) return false;
    return criteria.questions.every((q) => answers[q.id] !== undefined);
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <Navbar />

      {/* Main Content */}
      <main className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Top Info Bar */}
          <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-6 mb-8">
            <div>
              <p className="text-sm text-gray-600 mb-1">University</p>
              <h1 className="font-bold text-xl text-[#5C2E2E]">
                {institutionName}
              </h1>
            </div>

            <div className="flex-1 w-full lg:max-w-md">
              <div className="flex items-end justify-between mb-2">
                <p className="text-sm text-gray-600">Completion</p>
                <p className="text-sm text-gray-600">{calculateProgress()} %</p>
              </div>
              <div className="w-full h-3 bg-[#FFE5E5] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#A84032] transition-all duration-300"
                  style={{ width: `${calculateProgress()}%` }}
                ></div>
              </div>
            </div>

            <Link
              href="/"
              className="bg-white border border-[#A84032] text-[#A84032] hover:bg-[#A84032]/5 font-medium text-sm px-6 py-2 rounded-md transition-colors whitespace-nowrap"
            >
              Save and Exit
            </Link>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Navigation */}
            <aside className="w-full lg:w-64 flex-shrink-0">
              <nav className="bg-white border border-gray-200 rounded-lg p-3">
                {criteriaData.map((criteria) => (
                  <button
                    key={criteria.id}
                    onClick={() => setCurrentCriteria(criteria.id)}
                    className={`w-full text-left px-4 py-3 rounded-md font-medium text-sm mb-2 transition-colors flex items-center justify-between ${
                      currentCriteria === criteria.id
                        ? "bg-[#FFE5E5] text-[#A84032]"
                        : "text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    <span>
                      {criteria.id}. {criteria.title}
                    </span>
                    {isCriteriaCompleted(criteria.id) && (
                      <svg
                        className="w-4 h-4 text-green-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </button>
                ))}
              </nav>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1">
              <h2 className="font-bold text-2xl text-[#5C2E2E] mb-6">
                {currentCriteria}. {currentCriteriaData.title}
              </h2>

              {/* Render Questions */}
              {currentCriteriaData.questions.map((question, idx) => (
                <div
                  key={question.id}
                  className="bg-white border border-gray-200 rounded-lg p-6 mb-6"
                >
                  <h3 className="font-semibold text-base text-gray-900 mb-4">
                    {question.text}
                  </h3>

                  {question.type === "radio" && question.options && (
                    <div className="space-y-3 mb-6">
                      {question.options.map((option, optIdx) => (
                        <label
                          key={optIdx}
                          className="flex items-center gap-3 cursor-pointer group"
                        >
                          <input
                            type="radio"
                            name={question.id}
                            checked={
                              answers[question.id]?.value === option.value
                            }
                            onChange={() =>
                              handleAnswer(question.id, option.value)
                            }
                            className="w-5 h-5 text-[#A84032] accent-[#A84032] cursor-pointer"
                          />
                          <span className="text-sm text-gray-700 group-hover:text-gray-900">
                            {option.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  )}

                  {question.type === "likert" && (
                    <div>
                      <div className="flex justify-between mb-3">
                        <p className="text-xs text-gray-500">
                          Strongly Disagree
                        </p>
                        <p className="text-xs text-gray-500">Strongly Agree</p>
                      </div>
                      <div className="grid grid-cols-5 gap-2 mb-6">
                        {[0, 25, 50, 75, 100].map((value, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleAnswer(question.id, value)}
                            className={`h-10 rounded-md font-normal text-sm transition-all ${
                              answers[question.id]?.value === value
                                ? "border-2 border-[#A84032] bg-[#A84032]/5 text-[#A84032] font-medium"
                                : "border border-gray-300 text-gray-700 hover:border-[#A84032]/50"
                            }`}
                          >
                            {idx + 1}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Evidence Upload */}
                  <div>
                    <p className="font-medium text-sm text-gray-900 mb-3">
                      Evidence Upload
                    </p>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg h-24 flex flex-col items-center justify-center cursor-pointer hover:border-[#A84032]/50 transition-colors">
                      <p className="text-base text-[#A84032] mb-1">
                        + Upload Document
                      </p>
                      <p className="text-xs text-gray-500">
                        Drag and drop or click to upload
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              {/* Navigation Buttons */}
              <div className="flex justify-between items-center mt-8">
                <button
                  onClick={handleBack}
                  disabled={currentCriteria === 1}
                  className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium text-sm px-6 py-2 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ← Back
                </button>
                <button
                  onClick={handleNext}
                  className="bg-[#A84032] hover:bg-[#8B3528] text-white font-medium text-sm px-8 py-2 rounded-md transition-colors"
                >
                  {currentCriteria < 8 ? "Next Question →" : "Review & Submit"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#5C2E2E] text-white py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-6 md:space-y-0">
            <div className="flex flex-col space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-white/20 rounded"></div>
                <span className="text-xl font-bold">RAI</span>
              </div>
              <p className="text-sm text-white/80">
                Responsible AI Global University Ranking
              </p>
            </div>
            <div className="flex flex-col space-y-2">
              <p className="text-sm">Contact: info@rai-ranking.org</p>
              <div className="flex space-x-4 text-sm">
                <a href="#" className="hover:text-white/80 transition-colors">
                  Twitter/X
                </a>
                <a href="#" className="hover:text-white/80 transition-colors">
                  LinkedIn
                </a>
                <a href="#" className="hover:text-white/80 transition-colors">
                  GitHub
                </a>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-white/20">
            <p className="text-sm text-white/60 text-center md:text-left">
              © 2025 RAI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
