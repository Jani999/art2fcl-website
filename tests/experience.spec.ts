import { test, expect, type Page } from "@playwright/test";
const scenes = [
  "awakening",
  "divinity",
  "breach",
  "archive",
  "terminal",
  "transmission",
];
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("art2fcl-visited", "1"));
});
async function at(page: Page, id: string, progress = 0.6) {
  await page.evaluate(() => document.fonts.ready);
  await expect(page.locator(".cinematic-v2")).toBeVisible();
  if (
    await page.evaluate(
      () => !matchMedia("(prefers-reduced-motion: reduce)").matches,
    )
  )
    await expect(page.locator(".motion-ready")).toHaveCount(1);
  await page.evaluate(
    ({ id, progress }) => {
      const section = document.getElementById(id)!;
      const stage = section.querySelector<HTMLElement>(".scene-stage")!;
      const header = document.querySelector("header")!.clientHeight;
      const distance = Math.max(
        section.offsetHeight - stage.offsetHeight,
        stage.offsetHeight - innerHeight + header + 66,
        0,
      );
      window.scrollTo({
        top: Math.max(
          0,
          section.getBoundingClientRect().top +
            scrollY -
            header +
            distance * progress,
        ),
        behavior: "instant",
      });
    },
    { id, progress },
  );
  await page.waitForTimeout(900);
}
test("V2 visual QA at all five viewports and every cinematic chapter", async ({
  page,
}) => {
  test.setTimeout(180000);
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });
  for (const viewport of [
    { width: 1920, height: 1080 },
    { width: 1440, height: 900 },
    { width: 1366, height: 768 },
    { width: 390, height: 844 },
    { width: 375, height: 812 },
  ]) {
    await page.setViewportSize(viewport);
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    await expect(page.locator(".motion-ready")).toHaveCount(1);
    for (const id of scenes) {
      await at(
        page,
        id,
        id === "archive" ? 0.85 : id === "transmission" ? 0.92 : 0.6,
      );
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBeTruthy();
      if (id === "awakening") {
        const progress = await page
          .locator(".reading-progress")
          .evaluate(
            (el) => new DOMMatrixReadOnly(getComputedStyle(el).transform).a,
          );
        expect(progress).toBeLessThan(0.25);
      }
      if (id === "transmission") {
        const art = await page.locator(".reconstruction-art").boundingBox();
        expect(art!.x).toBeGreaterThanOrEqual(0);
        expect(art!.x + art!.width).toBeLessThanOrEqual(viewport.width + 1);
      }
      await page.screenshot({ path: `.local/v2/${viewport.width}-${id}.png` });
    }
  }
  expect(errors).toEqual([]);
});
test("all dossiers, keyboard modal focus and navigation remain functional", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.getByRole("button", { name: "INDEX", exact: true }).click();
  await page.keyboard.press("Escape");
  await expect(
    page.getByRole("button", { name: "INDEX", exact: true }),
  ).toBeFocused();
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
    await page.locator(".archive-panel").filter({ hasText: title }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.getByRole("button", { name: "Close dialog" }).click();
  }
  await page.getByRole("button", { name: "INDEX", exact: true }).click();
  await page
    .locator(".scene-nav button")
    .filter({ hasText: "TERMINAL" })
    .click();
  await expect(page.locator("#terminal")).toBeInViewport();
});
test("terminal commands, autocomplete, diagnostics and safe visual overrides", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const input = page.getByRole("textbox", { name: "Terminal command" });
  await input.fill("res");
  await input.press("Tab");
  await expect(input).toHaveValue("restore");
  await input.press("Enter");
  for (const cmd of [
    "help",
    "about",
    "status",
    "unknown",
    "corrupt",
    "restore",
    "scan",
  ]) {
    await input.fill(cmd);
    await input.press("Enter");
  }
  await expect(page.locator(".system-scan")).toHaveCount(1);
  await expect(page.getByRole("log")).toContainText("FICTIONAL DIAGNOSTICS");
  await expect(page.getByRole("log")).toContainText("Command not found");
  await expect(page.getByRole("log")).toContainText("[ RESTORED ]");
  await input.press("ArrowUp");
  await expect(input).toHaveValue("scan");
  await input.press("ArrowDown");
  await expect(input).toHaveValue("");
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
test("real audio plays, seeks, mutes and survives scene navigation", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Enable audio / play" }).click();
  await expect(page.getByRole("button", { name: "Pause audio" })).toBeVisible();
  await expect
    .poll(() =>
      page.locator("audio").evaluate((el: HTMLAudioElement) => el.currentTime),
    )
    .toBeGreaterThan(0.1);
  await page.getByRole("button", { name: "Expand player" }).click();
  await page.getByRole("slider", { name: "Seek audio" }).click();
  await expect
    .poll(() =>
      page.locator("audio").evaluate((el: HTMLAudioElement) => el.currentTime),
    )
    .toBeGreaterThan(10);
  const volume = page.getByRole("slider", { name: "Volume", exact: true });
  await volume.focus();
  await volume.press("Home");
  await volume.press("ArrowRight");
  expect(
    await page.locator("audio").evaluate((el: HTMLAudioElement) => el.volume),
  ).toBeLessThan(0.1);
  await page.getByRole("button", { name: "Mute audio", exact: true }).click();
  expect(
    await page.locator("audio").evaluate((el: HTMLAudioElement) => el.muted),
  ).toBeTruthy();
  await page.getByRole("button", { name: "Unmute audio" }).click();
  await page.getByRole("button", { name: "Collapse player" }).click();
  await page.getByRole("button", { name: "INDEX", exact: true }).click();
  await page
    .locator(".scene-nav button")
    .filter({ hasText: "ARCHIVE" })
    .click();
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
test("six timelines reverse, pins resize cleanly and restart works", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await expect(page.locator(".pin-spacer")).toHaveCount(6);
  await at(page, "divinity", 0.48);
  const split = await page
    .locator(".plane-cranial")
    .evaluate((el) => getComputedStyle(el).transform);
  await at(page, "divinity", 0);
  const assembled = await page
    .locator(".plane-cranial")
    .evaluate((el) => getComputedStyle(el).transform);
  expect(split).not.toEqual(assembled);
  await at(page, "transmission", 0.75);
  await page.getByRole("button", { name: "RESTART EXPERIENCE" }).click();
  await page.getByRole("button", { name: "SKIP INTRO" }).click();
  await expect.poll(() => page.evaluate(() => scrollY)).toBeLessThan(3);
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.locator(".pin-spacer")).toHaveCount(3);
  await page.setViewportSize({ width: 1440, height: 900 });
  await expect(page.locator(".pin-spacer")).toHaveCount(6);
});
test("shader renders transparently and stops drawing when idle or offscreen", async ({
  page,
}) => {
  await page.addInitScript(() => {
    const w = window as unknown as Window & { testDraws: number };
    w.testDraws = 0;
    const original = WebGL2RenderingContext.prototype.drawElements;
    WebGL2RenderingContext.prototype.drawElements = function (
      mode,
      count,
      type,
      offset,
    ) {
      w.testDraws++;
      return original.call(this, mode, count, type, offset);
    };
  });
  await page.goto("/");
  await at(page, "breach", 0.5);
  await expect(page.locator(".distortion-art")).toHaveAttribute(
    "data-ready",
    "true",
  );
  await page.waitForTimeout(1800);
  const count = () =>
    page.evaluate(
      () => (window as unknown as Window & { testDraws: number }).testDraws,
    );
  const first = await count();
  expect(first).toBeGreaterThan(0);
  await page.waitForTimeout(600);
  expect((await count()) - first).toBeLessThanOrEqual(2);
  await at(page, "terminal", 0.5);
  await page.waitForTimeout(1000);
  const off = await count();
  await page.waitForTimeout(500);
  expect(await count()).toBe(off);
});
test("WebGL loss restores the original fallback", async ({ page }) => {
  await page.goto("/");
  await at(page, "breach", 0.4);
  await expect(page.locator(".distortion-art")).toHaveAttribute(
    "data-ready",
    "true",
  );
  await page
    .locator(".distortion-art canvas")
    .evaluate((el: HTMLCanvasElement) =>
      el
        .getContext("webgl2")
        ?.getExtension("WEBGL_lose_context")
        ?.loseContext(),
    );
  await expect(page.locator(".distortion-art")).toHaveAttribute(
    "data-failed",
    "true",
  );
  await expect(page.locator(".shader-fallback")).toHaveCSS("opacity", "1");
});
test("reduced motion, quality controls, unavailable audio and safe player rail", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.route("**/audio/demons-shot.mp3", (route) => route.abort());
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/");
  await expect(page.locator(".boot")).toHaveCount(0);
  await expect(page.locator(".pin-spacer")).toHaveCount(0);
  await expect(page.locator(".distortion-art canvas")).toHaveCount(0);
  await expect(page.locator(".track")).toContainText("AUDIO UNAVAILABLE");
  await expect(page.locator(".awakening-art .art-static")).toHaveCSS(
    "opacity",
    "1",
  );
  await page.getByRole("button", { name: "PERFORMANCE: HIGH" }).click();
  await page.reload();
  await expect(
    page.getByRole("button", { name: "PERFORMANCE: LOW" }),
  ).toBeVisible();
  await at(page, "awakening", 0);
  const cue = await page
    .locator(".awakening-stage .scene-bottom a")
    .boundingBox();
  const rail = await page.locator("#player").boundingBox();
  expect(cue!.y + cue!.height).toBeLessThanOrEqual(rail!.y);
});
