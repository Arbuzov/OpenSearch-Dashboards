/*
 * SPDX-License-Identifier: Apache-2.0
 *
 * The OpenSearch Contributors require contributions made to
 * this file be licensed under the Apache-2.0 license or a
 * compatible open source license.
 */

/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

/*
 * Modifications Copyright OpenSearch Contributors. See
 * GitHub history for details.
 */

import React, { useEffect, useState } from 'react';
import { Observable } from 'rxjs';
import { I18nProvider } from '@osd/i18n/react';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';
import { CoreStart } from 'src/core/public';
import { NavigationPublicPluginStart } from 'src/plugins/navigation/public';
import { FetchResult } from 'src/plugins/newsfeed/public';
import { FeatureCatalogueEntry, FeatureCatalogueSolution } from 'src/plugins/home/public';
import { Overview } from './overview';

interface OpenSearchDashboardsOverviewAppDeps {
  basename: string;
  notifications: CoreStart['notifications'];
  http: CoreStart['http'];
  navigation: NavigationPublicPluginStart;
  newsfeed$?: Observable<FetchResult | null | void>;
  solutions: FeatureCatalogueSolution[];
  features: FeatureCatalogueEntry[];
}

export const OpenSearchDashboardsOverviewApp = ({
  basename,
  newsfeed$,
  solutions,
  features,
}: OpenSearchDashboardsOverviewAppDeps) => {
  const [newsFetchResult, setNewsFetchResult] = useState<FetchResult | null | void>(null);

  useEffect(() => {
    if (newsfeed$) {
      const subscription = newsfeed$.subscribe((res: FetchResult | void | null) => {
        setNewsFetchResult(res);
      });

      return () => subscription.unsubscribe();
    }
  }, [newsfeed$]);

  return (
    <Router basename={basename}>
      <I18nProvider>
        <Switch>
          <Route exact path="/">
            <Overview newsFetchResult={newsFetchResult} solutions={solutions} features={features} />
          </Route>
        </Switch>
      </I18nProvider>
    </Router>
  );
};
