// jest.config.js
module.exports = {
    // Тестовая среда
    testEnvironment: "jsdom", // Для тестирования React-компонентов
  
    // Обработка TypeScript
    preset: "ts-jest", 
    transform: {
      "^.+\\.(ts|tsx)$": "ts-jest",
    },
  
    // Где искать тесты
    testMatch: ["**/__tests__/**/*.+(ts|tsx)", "**/?(*.)+(spec|test).+(ts|tsx)"],
  
    // Игнорируемые пути
    testPathIgnorePatterns: ["/node_modules/", "/dist/"],
  
    // Настройки для абсолютных импортов (если используете)
    modulePaths: ["<rootDir>/src"],
    moduleNameMapper: {
        "react-router-dom": "<rootDir>/node_modules/react-router-dom",
      },
      setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"],
  };