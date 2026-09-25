const { spawn } = require("child_process");

const RUNNER_IMAGE = "verdictio-runner:latest";
const TIME_LIMIT = 5;

function dockerCommand(args, timeout = 10000) {
  return new Promise((resolve, reject) => {
    const child = spawn("docker", args, {
      windowsHide: true,
    });

    let stdout = "";
    let stderr = "";
    let timedOut = false;

    child.stdout.on("data", (data) => {
      stdout += data.toString();
    });

    child.stderr.on("data", (data) => {
      stderr += data.toString();
    });

    const timer = setTimeout(() => {
      timedOut = true;
      child.kill();
    }, timeout);

    child.on("error", (error) => {
      clearTimeout(timer);
      reject(error);
    });

    child.on("close", (code) => {
      clearTimeout(timer);

      resolve({
        code,
        stdout: stdout.trim(),
        stderr: stderr.trim(),
        timedOut,
      });
    });
  });
}

const createContainer = async (containerName, folderPath) => {
  const result = await dockerCommand([
    "run",
    "-d",
    "--name",
    containerName,

    "--network",
    "none",

    "--memory",
    "256m",

    "--memory-swap",
    "256m",

    "--cpus",
    "1.0",

    "--pids-limit",
    "64",

    "--cap-drop",
    "ALL",

    "--security-opt",
    "no-new-privileges",

    "--mount",
    `type=bind,source=${folderPath},target=/workspace`,

    RUNNER_IMAGE,

    "sleep",
    "infinity",
  ]);

  if (result.code !== 0) {
    throw new Error(`Container creation failed: ${result.stderr}`);
  }
};

const removeContainer = async (containerName) => {
  await dockerCommand(["rm", "-f", containerName]);
};

const executeInContainer = async (
  containerName,
  command,
  timeout = 8000,
) => {
  const result = await dockerCommand(
    [
      "exec",
      containerName,
      "sh",
      "-c",
      command,
    ],
    timeout,
  );

  if (result.timedOut || result.code === 124) {
    throw {
      killed: true,
      message: "Time Limit Exceeded",
    };
  }

  return result;
};

const executeCode = async (
  folderPath,
  language,
  code,
  input = "",
) => {
  let fileName;

  if (language === "cpp") fileName = "main.cpp";
  else if (language === "python") fileName = "main.py";
  else if (language === "javascript") fileName = "main.js";
  else if (language === "java") fileName = "Main.java";
  else throw new Error("Unsupported language");

  const fs = require("fs");
  const path = require("path");

  fs.writeFileSync(
    path.join(folderPath, fileName),
    code,
  );

  fs.writeFileSync(
    path.join(folderPath, "input.txt"),
    input.trim() + "\n",
  );

  const containerName =
    `verdictio-submission-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 8)}`;

  try {
    // 1. Create container
    await createContainer(containerName, folderPath);

    // 2. Compile once
    if (language === "cpp") {
      const result = await executeInContainer(
        containerName,
        "g++ /workspace/main.cpp -O2 -std=c++17 -o /workspace/main",
      );

      if (result.code !== 0) {
        throw {
          status: "Compilation Error",
          stderr: result.stderr,
        };
      }
    }

    if (language === "java") {
      const result = await executeInContainer(
        containerName,
        "javac /workspace/Main.java",
      );

      if (result.code !== 0) {
        throw {
          status: "Compilation Error",
          stderr: result.stderr,
        };
      }
    }

    // 3. Run program
    let runCommand;

    if (language === "cpp") {
      runCommand =
        `timeout ${TIME_LIMIT}s /workspace/main < /workspace/input.txt`;
    } else if (language === "python") {
      runCommand =
        `timeout ${TIME_LIMIT}s python3 /workspace/main.py < /workspace/input.txt`;
    } else if (language === "javascript") {
      runCommand =
        `timeout ${TIME_LIMIT}s node /workspace/main.js < /workspace/input.txt`;
    } else if (language === "java") {
      runCommand =
        `timeout ${TIME_LIMIT}s java -cp /workspace Main < /workspace/input.txt`;
    }

    const result = await executeInContainer(
      containerName,
      runCommand,
      8000,
    );

    if (result.code !== 0) {
      throw {
        status: "Runtime Error",
        stderr: result.stderr,
      };
    }

    return result.stdout;

  } finally {
    // 4. Remove container
    await removeContainer(containerName);
  }
};

module.exports = {
  executeCode,
};