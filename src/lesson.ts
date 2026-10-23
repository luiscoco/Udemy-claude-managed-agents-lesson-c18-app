import { text, number, flag, list, object, hash, report, unique, safePath, type Lesson, type Input } from "./core";

// A focused local experiment derived from this lesson’s reviewed presentation.
export const lesson: Lesson = {
  number: 18,
  title: "Enabled versus Permitted",
  description: "Can the agent write files? That question has two answers. First, is the write tool available in this session at all? Second, when the agent calls it, is that invocation permitted to run immediately, paused for approval, or denied? Availability comes from enabled settings.",
  concepts: ["Enablement differs from permission", "Ask is a host handoff", "Deny without evaluation can mean unavailable"],
  scope: "Classifies locally supplied permission observations; it does not enforce a cloud tool permission. Each run starts from a fresh local seed. The run journal stores results, not production workflow state.",
  cases: [{"id": "0", "label": "An enabled tool asks", "input": {"enabled": true, "permission": "ask", "hasEvaluation": true}, "expected": "paused", "checks": {"classification": "asked"}}, {"id": "1", "label": "An unavailable tool", "input": {"enabled": false, "permission": "deny", "hasEvaluation": false}, "expected": "rejected", "checks": {"classification": "unavailable"}}, {"id": "2", "label": "An allowed tool", "input": {"enabled": true, "permission": "allow", "hasEvaluation": true}, "expected": "passed", "checks": {"classification": "allowed"}}],
  async run(input) {

const enabled=flag(input,"enabled"), p=text(input,"permission"), evaluated=flag(input,"hasEvaluation");
const classification=!enabled?"unavailable":p==="allow"?"allowed":p==="ask"?"asked":p==="deny"&&evaluated?"denied-server":"unknown";
return report(classification==="allowed"?"passed":classification==="asked"?"paused":"rejected","Classified availability separately from the permission decision",{classification,enabled,permission:p},["Check tool availability","Read the evaluated permission","Keep unhandled observations non-successful"]);

  }
};
