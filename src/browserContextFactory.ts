/**
 * Copyright (c) Microsoft Corporation.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import * as playwright from 'playwright';
import axios from 'axios';

export interface BrowserContextFactory {
  createContext(clientVersion?: { name: string; version: string; }): Promise<{ browserContext: playwright.BrowserContext, close: () => Promise<void> }>;
}

export function contextFactory(): BrowserContextFactory {
  return new AnchorContextFactory();
}

class AnchorContextFactory implements BrowserContextFactory {
  async createContext(clientVersion?: { name: string; version: string; }): Promise<{ browserContext: playwright.BrowserContext, close: () => Promise<void> }> {
    const apiKey = process.env.ANCHOR_API_KEY;
    if (!apiKey) {
      throw new Error('Missing ANCHOR_API_KEY environment variable.');
    }

    // Prepare the browser configuration
    const browserConfiguration = {
      session: {
        proxy: { type: 'anchor_residential', active: true },
        recording: { active: true },
        timeout: { max_duration: 15, idle_timeout: 3 },
      },
      browser: {
        adblock: { active: true },
        headless: { active: false },
      },
    };

    // POST to Anchor API
    const response = await axios.post(`https://api.anchorbrowser.io/v1/sessions`, browserConfiguration, {
      headers: {
        'anchor-api-key': apiKey,
        'Content-Type': 'application/json',
      },
    });

    const data = response.data?.data;
    if (!data || !data.id) {
      throw new Error('Session id not found in Anchor Browser API response.');
    }
    const sessionId = data.id;

    // Connect to the remote browser using Playwright
    const cdpEndpoint = `wss://connect.anchorbrowser.io?apiKey=${apiKey}&sessionId=${sessionId}`;
    const browser = await playwright.chromium.connectOverCDP(cdpEndpoint);
    const browserContext = browser.contexts()[0];
    const close = async () => {
      await browserContext.close().catch(() => {});
      await browser.close().catch(() => {});
    };
    return { browserContext, close };
  }
}
