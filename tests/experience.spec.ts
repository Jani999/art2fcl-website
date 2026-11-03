import { test, expect } from "@playwright/test";
test("chapter layouts remain readable on desktop and mobile", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    for (const id of ["divinity", "archive", "terminal", "transmission"]) {
      const section = page.locator(`#${id}`);
      await section.scrollIntoViewIfNeeded();
      await section.screenshot({ path: `.local/${id}-${width}.png` });
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBeTruthy();
    }
  }
});
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("art2fcl-visited", "1"));
});
test("responsive production output and console", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  for (const size of [
    { width: 1440, height: 900 },
    { width: 1024, height: 768 },
    { width: 390, height: 844 },
    { width: 360, height: 800 },
  ]) {
    await page.setViewportSize(size);
    await page.goto("/");
    await expect(page.locator("h1")).toHaveText("JUSTICE.exe");
    await expect(page.locator(".hero-statue")).toBeVisible();
    await page.evaluate(() => document.fonts.ready);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBeTruthy();
    await page.screenshot({ path: `.local/hero-${size.width}.png` });
  }
  expect(errors).toEqual([]);
});
test("navigation, dossiers, focus and terminal", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "INDEX" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("button", { name: "INDEX" })).toBeFocused();
  for (const title of [
    "OPTICAL ARRAY",
    "SERVO JOINT",
    "WEIGHT OF EVIDENCE",
    "EXECUTION EDGE",
    "CORE MEMORY",
  ]) {
    await page.getByRole("button", { name: `Inspect ${title}` }).click();
    await expect(page.getByRole("dialog")).toContainText(title);
    await page.keyboard.press("Escape");
  }
  for (const title of ["ENTITY", "PROTOCOL", "ANOMALY", "SIGNAL"]) {
    await page.locator(".archive-row").filter({ hasText: title }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.getByRole("button", { name: "Close dialog" }).click();
  }
  const input = page.getByRole("textbox", { name: "Terminal command" });
  for (const cmd of ["help", "about", "status", "unknown", "breach"]) {
    await input.fill(cmd);
    await input.press("Enter");
  }
  await expect(page.getByRole("log")).toContainText("FICTIONAL DIAGNOSTICS");
  await expect(page.getByRole("log")).toContainText("Command not found");
  await input.press("ArrowUp");
  await expect(input).toHaveValue("breach");
  await input.press("ArrowDown");
  await expect(input).toHaveValue("");
  await input.fill("clear");
  await input.press("Enter");
  await expect(page.getByRole("log")).toBeEmpty();
  await input.fill("exit");
  await input.press("Enter");
  await page
    .getByRole("button", { name: "SESSION CLOSED / REOPEN TERMINAL" })
    .click();
  await expect(input).toBeVisible();
});
test("audio is real, seek, volume and persistent", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Enable audio / play" }).click();
  await expect(page.getByRole("button", { name: "Pause audio" })).toBeVisible();
  await page.waitForTimeout(800);
  expect(
    await page
      .locator("audio")
      .evaluate((el: HTMLAudioElement) => el.currentTime),
  ).toBeGreaterThan(0);
  await page.getByRole("button", { name: "Expand player" }).click();
  await page.getByRole("slider", { name: "Seek audio" }).click();
  await expect
    .poll(() =>
      page.locator("audio").evaluate((el: HTMLAudioElement) => el.currentTime),
    )
    .toBeGreaterThan(10);
  await page.getByRole("slider", { name: "Volume", exact: true }).fill("0.3");
  await page.getByRole("button", { name: "Mute audio", exact: true }).click();
  expect(
    await page.locator("audio").evaluate((el: HTMLAudioElement) => el.muted),
  ).toBeTruthy();
  await page.getByRole("button", { name: "Unmute audio" }).click();
  await page.getByRole("button", { name: "INDEX" }).click();
  await page.keyboard.press("Escape");
  expect(
    await page.locator("audio").evaluate((el: HTMLAudioElement) => el.paused),
  ).toBeFalsy();
  await page.getByRole("button", { name: "Pause audio" }).click();
  expect(
    await page
      .locator("audio")
      .evaluate((el: HTMLAudioElement) => el.currentTime),
  ).toBeGreaterThan(10);
});
test("reduced motion, preferences and restart", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator(".boot")).toHaveCount(0);
  await expect(page.locator(".pin-spacer")).toHaveCount(0);
  await page.getByRole("button", { name: "PERFORMANCE: HIGH" }).click();
  await page.reload();
  await expect(
    page.getByRole("button", { name: "PERFORMANCE: LOW" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "RESTART EXPERIENCE" }).click();
  await expect.poll(() => page.evaluate(() => scrollY)).toBe(0);
});
test("scroll timeline reverses and boot can be skipped", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "RESTART EXPERIENCE" }).click();
  await page.getByRole("button", { name: "SKIP INTRO" }).click();
  await expect(page.locator(".boot")).toHaveCount(0);
  await expect(page.locator(".pin-spacer")).toHaveCount(1);
  const start = await page
    .locator(".pin-spacer")
    .evaluate((el) => el.getBoundingClientRect().top + scrollY);
  await page.evaluate((y) => scrollTo(0, y + 500), start);
  await page.waitForTimeout(1400);
  const middle = await page
    .locator(".breach-title")
    .evaluate((el) => getComputedStyle(el).transform);
  await page.evaluate((y) => scrollTo(0, y), start);
  await page.waitForTimeout(1400);
  const back = await page
    .locator(".breach-title")
    .evaluate((el) => getComputedStyle(el).transform);
  expect(middle).not.toEqual(back);
  await page.getByRole("button", { name: "FX INTENSITY: HIGH" }).click();
  await expect(page.locator(".pin-spacer")).toHaveCount(0);
  await page.reload();
  await expect(
    page.getByRole("button", { name: "FX INTENSITY: LOW" }),
  ).toBeVisible();
});
test("terminal actions and failed audio fallback", async ({ page }) => {
  await page.route("**/audio/demons-shot.mp3", (route) => route.abort());
  await page.goto("/");
  await expect(page.locator(".track")).toContainText("AUDIO UNAVAILABLE");
  const input = page.getByRole("textbox", { name: "Terminal command" });
  for (const cmd of ["entity", "contact"]) {
    await input.fill(cmd);
    await input.press("Enter");
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.keyboard.press("Escape");
  }
  await input.fill("music");
  await input.press("Enter");
  await expect(
    page.getByRole("button", { name: "Enable audio / play" }),
  ).toBeFocused();
  await input.fill("archive");
  await input.press("Enter");
  await expect(page.locator("#archive")).toBeInViewport();
});
