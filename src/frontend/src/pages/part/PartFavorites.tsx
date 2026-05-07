import { t } from '@lingui/core/macro';
import { Stack } from '@mantine/core';
import { IconStarFilled } from '@tabler/icons-react';

import { PageDetail } from '../../components/nav/PageDetail';
import { PartListTable } from '../../tables/part/PartTable';

/**
 * My Favorites Page - Displays all parts starred by the current user
 */
export default function PartFavorites() {
  return (
    <Stack gap='xs'>
      <PageDetail
        title={t`My Favorites`}
        subtitle={t`Parts you have starred for quick access`}
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
