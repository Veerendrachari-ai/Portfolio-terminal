import React, { useState, useRef, useEffect } from 'react';
import projects from '../data/projects';
import skills from '../data/skills';
import social from '../data/social';
import about from '../data/about';
import '../styles/Console.css';

export default function Console() {
  const [command, setCommand] = useState('');
  const [history, setHistory] = useState([]);
  const variables = useRef({});
  const inputRef = useRef(null);
  const containerRef = useRef(null);

  // Arrays for jokes and motivational quotes
  const jokes = [
    "Why do programmers prefer dark mode? Because light attracts bugs! 😄",
    "Why do Java developers wear glasses? Because they don't see sharp. 🤓",
    "How many programmers does it take to change a light bulb? None, that's a hardware problem!",
    "I would tell you a UDP joke, but you might not get it.",
    "Why did the programmer quit his job? Because he didn't get arrays. 😅",
    "Debugging: Being the detective in a crime movie where you are also the murderer."
  ];

  const motivations = [
    "Keep going, you're doing great! 💪",
    "Every line of code brings you closer to mastery!",
    "Success is built one step at a time. 🚀",
    "Believe in yourself; you got this!",
    "Mistakes are proof that you are trying. Keep coding!",
    "The harder you work, the luckier you get!"
  ];

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, []);

  const openLink = (url) => {
    if (url) window.open(url, '_blank');
  };

  const runCommand = (rawCmd) => {
    const cmd = rawCmd.trim().toLowerCase();
    if (!cmd) return;

    setHistory((prev) => [...prev, { cmd: rawCmd, res: [] }]);

    setTimeout(() => {
      let res = [];

      try {
        switch (cmd) {
          // Clear terminal
          case 'cls':
            setHistory([]);
            setCommand('');
            return;

          // Help
          case 'help':
            res = [
              'Portfolio Commands:',
              '- show projects',
              '- show skills',
              '- about',
              '- contact',
              '- show social',
              '- show github',
              '- print "text"',
              '- let name = "value"',
              '- calc 5 + 3',
              '- cls (clear terminal)',
              '- help',
              'Chatty Commands:',
              '- hello / hi',
              '- how are you',
              '- tell me a joke',
              '- time',
              '- date',
              '- motivate me',
            ];
            break;

          // Portfolio info
          case 'about':
            res = about.split('\n');
            break;

          case 'contact':
            res = ['Email: veerendrachari7899@gmail.com', 'LinkedIn: https://www.linkedin.com/in/veerendra-achari'];
            break;

          case 'show skills':
            res = skills.map((s, i) => `${i + 1}. ${s}`);
            break;

          case 'show projects':
            res = projects.map((p, i) => (
              <div
                key={i}
                className="link"
                style={{ color: '#00ff99', cursor: 'pointer' }}
                onClick={() => openLink(p.link)}
              >
                {i + 1}. {p.name} — {p.short} [Link]
              </div>
            ));
            break;

          case 'show social':
            res = Object.entries(social).map(([name, link], i) => (
              <div
                key={i}
                className="link"
                style={{ color: '#00ff99', cursor: 'pointer' }}
                onClick={() => openLink(link)}
              >
                {name}: {link}
              </div>
            ));
            break;

          case 'show github':
            res = projects.map((p, i) => (
              <div
                key={i}
                className="link"
                style={{ color: '#00ff99', cursor: 'pointer' }}
                onClick={() => openLink(p.link)}
              >
                {i + 1}. {p.name} - {p.link}
              </div>
            ));
            break;

          // Chatty commands
          case 'hello':
          case 'hi':
            res = ['Hello! I am your portfolio assistant 🤖. Type "help" to see all commands.'];
            break;

          case 'how are you':
            res = ["I'm just code, but I'm running smoothly! How about you?"];
            break;

          case 'tell me a joke':
            res = [jokes[Math.floor(Math.random() * jokes.length)]];
            break;

          case 'time':
            res = [`Current time: ${new Date().toLocaleTimeString()}`];
            break;

          case 'date':
            res = [`Today's date: ${new Date().toLocaleDateString()}`];
            break;

          case 'motivate me':
            res = [motivations[Math.floor(Math.random() * motivations.length)]];
            break;

          // Project details
          default:
            if (cmd.startsWith('project')) {
              const idx = parseInt(cmd.split(' ')[1], 10);
              if (!isNaN(idx) && idx >= 1 && idx <= projects.length) {
                const p = projects[idx - 1];
                res = [
                  `Name: ${p.name}`,
                  `Description: ${p.description}`,
                  `Tech: ${p.tech.join(', ')}`,
                  <div
                    key="link"
                    className="link"
                    style={{ color: '#00ff99', cursor: 'pointer' }}
                    onClick={() => openLink(p.link)}
                  >
                    Link: {p.link || '#'}
                  </div>,
                ];
              } else res = ['Project not found. Use "show projects"'];
            } else if (cmd.startsWith('let ')) {
              const match = cmd.match(/^let\s+(\w+)\s*=\s*["'](.+)["']$/);
              if (match) {
                const [, varName, value] = match;
                variables.current[varName] = value;
                res = [`Variable ${varName} set to "${value}"`];
              } else res = ['Invalid syntax. Use: let name = "value"'];
            } else if (cmd.startsWith('print ')) {
              const match = cmd.match(/^print\s+["'](.+)["']$/);
              res = [match ? match[1] : 'Invalid print syntax'];
            } else if (cmd.startsWith('calc ')) {
              const expr = cmd.slice(5);
              if (/^[0-9+\-*/ ().]+$/.test(expr)) {
                // eslint-disable-next-line no-eval
                res = [`${expr} = ${eval(expr)}`];
              } else res = ['Invalid arithmetic expression'];
            } else res = [`Unknown command: ${cmd}`];
            break;
        }
      } catch (e) {
        res = [`Error: ${e.message}`];
      }

      // Animate typing line by line
      setHistory((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = { cmd: rawCmd, res: [] };
        res.forEach((line, i) => {
          setTimeout(() => {
            updated[updated.length - 1].res = [
              ...updated[updated.length - 1].res,
              line,
            ];
            setHistory([...updated]);
            if (containerRef.current) {
              containerRef.current.scrollTop = containerRef.current.scrollHeight;
            }
          }, i * 30);
        });
        return updated;
      });
    }, 100);

    setCommand('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') runCommand(command);
  };

  return (
    <div className="console-wrapper-full">
      <div className="console-card" ref={containerRef}>
        <div className="console-title">PORTFOLIO TERMINAL</div>

        <div className="console-body">
          {history.map((item, i) => (
            <div className="console-line" key={i}>
              <div className="prompt">$ {item.cmd}</div>
              <div className="response">
                {item.res.map((line, j) => (
                  <div key={j}>{line}</div>
                ))}
              </div>
            </div>
          ))}

          <div className="console-input">
            <div className="prompt">$</div>
            <input
              ref={inputRef}
              className="cmd-input"
              value={command}
              onChange={(e) => setCommand(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder='Type commands like: show projects'
              spellCheck={false}
            />
          </div>
        </div>

        <div className="console-footer">
          Type <code>help</code> to see all commands
        </div>
      </div>
    </div>
  );
}
