import { t } from '@lingui/core/macro';
import { Stack } from '@mantine/core';
import { IconStarFilled } from '@tabler/icons-react';
import { useMemo } from 'react';

import { UserRoles } from '@lib/enums/Roles';
import PermissionDenied from '../../components/errors/PermissionDenied';
import { PageDetail } from '../../components/nav/PageDetail';
import { useUserState } from '../../states/UserState';
import { PartListTable } from '../../tables/part/PartTable';

/**
 * Page component for displaying user's favorite (starred) parts.
 * Displays a table of all parts that the current user has starred,
 * providing quick access to frequently used parts.
 */
export default function PartFavorites() {
  const user = useUserState();

  // Table props to filter only starred parts
  const tableProps = useMemo(() => {
    return {
      params: {
        starred: true
      }
    };
  }, []);

  // Check user permissions
  if (!user.isLoggedIn() || !user.hasViewRole(UserRoles.part)) {
    return <PermissionDenied />;
  }

  return (
    <Stack gap='xs'>
      <PageDetail title={t`My Favorites`} icon={<IconStarFilled />} />
      <PartListTable props={tableProps} />
    </Stack>
  );
}
