export const ReplacedotInEmail = (UserEmail: string) => {
  let ReplacedUserEmail = UserEmail.replace('.com', '');
  return ReplacedUserEmail;
};
