
// P3372 Generator and Reference Solver (JavaScript implementation of Segment Tree logic)

export interface TestCase {
  id: number;
  input: string;
  expectedOutput: string;
}

// Random integer generator
const random = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

// Reference Solution using Brute Force with BigInt (O(NM)) 
// Since N and M in browser tests are scaled down for UI performance, O(NM) is acceptable and less error-prone than complex logic.
// However, to be robust, let's implement the actual logic or a clean simulation.
const solveP3372 = (input: string): string => {
  const lines = input.trim().split('\n');
  const [nStr, mStr] = lines[0].trim().split(/\s+/);
  const n = parseInt(nStr);
  const m = parseInt(mStr);
  
  // BigInt array for 64-bit support
  const arr = lines[1].trim().split(/\s+/).map(x => BigInt(x));
  
  const output: string[] = [];
  
  let lineIdx = 2;
  for (let i = 0; i < m; i++) {
    while(lineIdx < lines.length && lines[lineIdx].trim() === '') lineIdx++; // skip empty
    if (lineIdx >= lines.length) break;

    const parts = lines[lineIdx].trim().split(/\s+/).map(x => BigInt(x));
    lineIdx++;

    const op = parts[0];
    const x = Number(parts[1]) - 1; // 0-indexed
    const y = Number(parts[2]) - 1; // 0-indexed

    if (op === 1n) {
       // Update: 1 x y k
       const k = parts[3];
       for (let j = x; j <= y; j++) {
         arr[j] += k;
       }
    } else {
       // Query: 2 x y
       let sum = 0n;
       for (let j = x; j <= y; j++) {
         sum += arr[j];
       }
       output.push(sum.toString());
    }
  }
  
  return output.join('\n');
};

export const generateP3372TestCases = (count: number = 10): TestCase[] => {
  const cases: TestCase[] = [];

  for (let i = 0; i < count; i++) {
    // Generate scale based on case index to simulate difficulty tiers
    // Cases 0-2: Small (N <= 10)
    // Cases 3-6: Medium (N <= 100)
    // Cases 7-9: Large (for browser, we cap at 2000 to keep UI responsive)
    let n, m;
    if (i < 3) { n = random(5, 10); m = random(5, 10); }
    else if (i < 7) { n = random(50, 100); m = random(50, 100); }
    else { n = random(1000, 2000); m = random(1000, 2000); }

    const arr = Array.from({ length: n }, () => random(1, 100)).join(' ');
    
    let inputStr = `${n} ${m}\n${arr}\n`;
    
    for (let j = 0; j < m; j++) {
      const op = random(1, 2);
      let x = random(1, n);
      let y = random(1, n);
      if (x > y) [x, y] = [y, x];
      
      if (op === 1) {
        const k = random(1, 100);
        inputStr += `1 ${x} ${y} ${k}\n`;
      } else {
        inputStr += `2 ${x} ${y}\n`;
      }
    }

    const expectedOutput = solveP3372(inputStr);
    
    cases.push({
      id: i + 1,
      input: inputStr,
      expectedOutput: expectedOutput
    });
  }

  return cases;
};
