export const getFullName = (profile?: { lastname: string; firstname: string; middlename: string | null } | null) =>
  profile ? `${profile.lastname} ${profile.firstname} ${profile.middlename ?? ""}` : "-";
