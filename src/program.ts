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

import { program, Option } from 'commander';
// @ts-ignore
import { startTraceViewerServer } from 'playwright-core/lib/server';

import { startHttpServer, startHttpTransport, startStdioTransport } from './transport.js';
import { commaSeparatedList, resolveCLIConfig, semicolonSeparatedList } from './config.js';
import { Server } from './server.js';
import { packageJSON } from './package.js';
import { runWithExtension } from './extension/main.js';
import { filteredTools } from './tools.js';

program
    .version('Version ' + packageJSON.version)
    .name(packageJSON.name)
    .description('Anchor Browser MCP Server - Remote browser automation with built-in proxies and stealth')
    .option('--config <path>', 'path to the configuration file.')
    .option('--host <host>', 'host to bind server to. Default is localhost. Use 0.0.0.0 to bind to all interfaces.')
    .option('--port <port>', 'port to listen on for HTTP transport (Docker/server mode).')
    .addOption(new Option('--vision', 'Legacy option, use --caps=vision instead').hideHelp())
    .action(async options => {
      if (options.vision) {
        // eslint-disable-next-line no-console
        console.error('The --vision option is deprecated, use --caps=vision instead');
        options.caps = 'vision';
      }
      const config = await resolveCLIConfig(options);

      if (options.extension) {
        await runWithExtension(config);
        return;
      }

      const server = new Server(config, filteredTools(config));
      server.setupExitWatchdog();

      if (config.server.port !== undefined) {
        const httpServer = await startHttpServer(config.server);
        startHttpTransport(httpServer, server);
      } else {
        await startStdioTransport(server);
      }

      if (config.saveTrace) {
        const server = await startTraceViewerServer();
        const urlPrefix = server.urlPrefix('human-readable');
        const url = urlPrefix + '/trace/index.html?trace=' + config.browser.launchOptions.tracesDir + '/trace.json';
        // eslint-disable-next-line no-console
        console.error('\nTrace viewer listening on ' + url);
      }
    });

void program.parseAsync(process.argv);
