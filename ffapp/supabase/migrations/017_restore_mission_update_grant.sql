-- Restore ordinary mission updates; migration 016 blocks tariff-field mutation with a BEFORE UPDATE trigger.
grant update on ffapp.missions to authenticated;
revoke insert,delete on ffapp.missions from authenticated;
