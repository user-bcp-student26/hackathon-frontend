import { Routes } from '@angular/router';
import { authGuard } from './core/auth/auth.guard';
import { WorkspaceLayout } from './shared/workspace-layout/workspace-layout';

export const routes: Routes = [
	{
		path: 'ingresar',
		loadComponent: () =>
			import('./features/auth/login.page').then((module) => module.LoginPage),
	},
	{
		path: 'registro',
		loadComponent: () =>
			import('./features/auth/registration.page').then(
				(module) => module.RegistrationPage,
			),
	},
		{
			path: '',
			component: WorkspaceLayout,
			canActivate: [authGuard],
			children: [
				{
					path: 'wallet',
					loadComponent: () =>
						import('./features/wallet/wallet.page').then(
							(module) => module.WalletPage,
						),
				},
				{
					path: 'contactos',
					loadComponent: () =>
						import('./features/contacts/contacts.page').then(
							(module) => module.ContactsPage,
						),
				},
				{ path: '', pathMatch: 'full', redirectTo: 'wallet' },
			],
		},
	{ path: '**', redirectTo: 'ingresar' },
];
