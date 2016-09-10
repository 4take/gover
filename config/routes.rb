Rails.application.routes.draw do
  resources :addresses, only: %i(create update)
	get '/addresses/user/:id', to: 'addresses#show_by_user'
	get '/addresses/:token', to: 'addresses#show_by_token'

  resources :users
	post '/users/authenticate', to: 'users#authenticate'
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
	root 'application#index'
end
