/**
 * Sentinel — 24/7 Competitive Intelligence Engine.
 * Runs WITHOUT human sessions. Watches everything. Alerts before competitors announce.
 *
 * Collection → Analysis → Alerting
 */

export { checkAllRepos, checkLatestRelease, MONITORED_REPOS, type GitHubRelease } from "./collectors/github-monitor.js";
export { checkAllPackages, checkPackageVersion, TRACKED_PACKAGES, type NpmPackageInfo } from "./collectors/npm-watcher.js";
export { fetchHackerNewsTop, calculateRelevance, type NewsItem } from "./collectors/tech-news.js";
export { assessReleaseThreat, type ThreatAssessment, type ThreatLevel } from "./analyzers/threat-analyzer.js";
export { sendSlackAlert, formatThreatAlert, formatDailyDigest, type SlackConfig } from "./alerts/slack.js";
