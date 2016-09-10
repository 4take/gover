Rails.application.routes.draw do
  resources :addresses
	get '/addresses/user/:id', to: 'addresses#show_by_user'
  resources :users
	post '/users/authenticate', to: 'users#authenticate'
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
	root 'application#index'
end
