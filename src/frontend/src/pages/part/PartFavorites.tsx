import { t } from '@lingui/core/macro';
import { Stack } from '@mantine/core';
import { IconStar } from '@tabler/icons-react';

import { PageDetail } from '../../components/nav/PageDetail';
import { PartListTable } from '../../tables/part/PartTable';

/**
 * Page component for displaying user's favorited parts.
 * Shows all parts that the current user has starred.
 */
export default function PartFavorites() {
  return (
    <Stack gap='xs'>
      <PageDetail
        title={t`My Favorites`}
        icon={<IconStar />}
        subtitle={t`Parts you have starred for quick access`}
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

