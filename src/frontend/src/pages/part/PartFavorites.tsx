import { t } from '@lingui/core/macro';
import { Stack } from '@mantine/core';
import { IconStarFilled } from '@tabler/icons-react';

import { PageDetail } from '../../components/nav/PageDetail';
import { PartListTable } from '../../tables/part/PartTable';

/**
 * PartFavorites page component
 * Displays all parts starred by the current user
 */
export default function PartFavorites() {
  return (
    <Stack gap='xs'>
      <PageDetail
        title={t`My Favorites`}
        icon={<IconStarFilled />}
        subtitle={t`Parts you have starred for quick access`}
      />
      <PartListTable
        enableImport={false}
        props={{
          params: {
            starred: true
          }
        }}
      />
    </Stack>
  );
}
