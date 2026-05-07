import { t } from '@lingui/core/macro';
import { Stack } from '@mantine/core';
import { IconStarFilled } from '@tabler/icons-react';
import { useMemo } from 'react';

import { PageDetail } from '../../components/nav/PageDetail';
import { PartListTable } from '../../tables/part/PartTable';

/**
 * PartFavorites - Displays a list of parts that the user has starred
 * 
 * This page provides quick access to frequently used parts by showing
 * all parts marked as favorites by the current user.
 */
export default function PartFavorites() {
  const breadcrumbs = useMemo(() => {
    return [{ name: t`Parts`, url: '/part' }];
  }, []);

  return (
    <Stack gap='xs'>
      <PageDetail
        title={t`My Favorites`}
        subtitle={t`Parts you have starred for quick access`}
        icon={<IconStarFilled />}
        breadcrumbs={breadcrumbs}
      />
      <PartListTable
        props={{
          params: {
            starred: true
          }
        }}
      />
    </Stack>
  );
}
