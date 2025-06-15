// components/supervisor/ActionMenu.jsx
export function TruckActionMenu({ truck }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button variant="ghost" size="icon">
          <MoreVerticalIcon size={16} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>View Maintenance History</DropdownMenuItem>
        {truck.status === 'stuck' && (
          <DropdownMenuItem className="text-red-600">
            Initiate Recovery
          </DropdownMenuItem>
        )}
        <DropdownMenuItem>Generate Report</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}