import { t } from '@lingui/core/macro';
import { Stack } from '@mantine/core';
import { IconStarFilled } from '@tabler/icons-react';

import { PageDetail } from '../../components/nav/PageDetail';
import { PartListTable } from '../../tables/part/PartTable';

/**
 * PartFavorites - Display a list of parts that the current user has starred
 * 
 * This page shows all parts marked as favorites by the logged-in user,
 * providing quick access to frequently used parts.
 */
export default function PartFavorites() {
  return (
    <Stack gap="xs">
      <PageDetail
        title={t`My Favorites`}
        icon={<IconStarFilled />}
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
