import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\ProdukController::index
* @see app/Http/Controllers/ProdukController.php:21
* @route '/produk'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/produk',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ProdukController::index
* @see app/Http/Controllers/ProdukController.php:21
* @route '/produk'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProdukController::index
* @see app/Http/Controllers/ProdukController.php:21
* @route '/produk'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ProdukController::index
* @see app/Http/Controllers/ProdukController.php:21
* @route '/produk'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ProdukController::index
* @see app/Http/Controllers/ProdukController.php:21
* @route '/produk'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ProdukController::index
* @see app/Http/Controllers/ProdukController.php:21
* @route '/produk'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ProdukController::index
* @see app/Http/Controllers/ProdukController.php:21
* @route '/produk'
*/
indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

index.form = indexForm

/**
* @see \App\Http\Controllers\ProdukController::show
* @see app/Http/Controllers/ProdukController.php:118
* @route '/produk/{produk}/show'
*/
export const show = (args: { produk: string | number | { slug: string | number } } | [produk: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/produk/{produk}/show',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ProdukController::show
* @see app/Http/Controllers/ProdukController.php:118
* @route '/produk/{produk}/show'
*/
show.url = (args: { produk: string | number | { slug: string | number } } | [produk: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { produk: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'slug' in args) {
        args = { produk: args.slug }
    }

    if (Array.isArray(args)) {
        args = {
            produk: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        produk: typeof args.produk === 'object'
        ? args.produk.slug
        : args.produk,
    }

    return show.definition.url
            .replace('{produk}', parsedArgs.produk.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProdukController::show
* @see app/Http/Controllers/ProdukController.php:118
* @route '/produk/{produk}/show'
*/
show.get = (args: { produk: string | number | { slug: string | number } } | [produk: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ProdukController::show
* @see app/Http/Controllers/ProdukController.php:118
* @route '/produk/{produk}/show'
*/
show.head = (args: { produk: string | number | { slug: string | number } } | [produk: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ProdukController::show
* @see app/Http/Controllers/ProdukController.php:118
* @route '/produk/{produk}/show'
*/
const showForm = (args: { produk: string | number | { slug: string | number } } | [produk: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ProdukController::show
* @see app/Http/Controllers/ProdukController.php:118
* @route '/produk/{produk}/show'
*/
showForm.get = (args: { produk: string | number | { slug: string | number } } | [produk: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ProdukController::show
* @see app/Http/Controllers/ProdukController.php:118
* @route '/produk/{produk}/show'
*/
showForm.head = (args: { produk: string | number | { slug: string | number } } | [produk: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

show.form = showForm

/**
* @see \App\Http\Controllers\ProdukController::preview
* @see app/Http/Controllers/ProdukController.php:160
* @route '/produk/{produk}/preview'
*/
export const preview = (args: { produk: string | number } | [produk: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: preview.url(args, options),
    method: 'get',
})

preview.definition = {
    methods: ["get","head"],
    url: '/produk/{produk}/preview',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ProdukController::preview
* @see app/Http/Controllers/ProdukController.php:160
* @route '/produk/{produk}/preview'
*/
preview.url = (args: { produk: string | number } | [produk: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { produk: args }
    }

    if (Array.isArray(args)) {
        args = {
            produk: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        produk: args.produk,
    }

    return preview.definition.url
            .replace('{produk}', parsedArgs.produk.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProdukController::preview
* @see app/Http/Controllers/ProdukController.php:160
* @route '/produk/{produk}/preview'
*/
preview.get = (args: { produk: string | number } | [produk: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: preview.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ProdukController::preview
* @see app/Http/Controllers/ProdukController.php:160
* @route '/produk/{produk}/preview'
*/
preview.head = (args: { produk: string | number } | [produk: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: preview.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ProdukController::preview
* @see app/Http/Controllers/ProdukController.php:160
* @route '/produk/{produk}/preview'
*/
const previewForm = (args: { produk: string | number } | [produk: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: preview.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ProdukController::preview
* @see app/Http/Controllers/ProdukController.php:160
* @route '/produk/{produk}/preview'
*/
previewForm.get = (args: { produk: string | number } | [produk: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: preview.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ProdukController::preview
* @see app/Http/Controllers/ProdukController.php:160
* @route '/produk/{produk}/preview'
*/
previewForm.head = (args: { produk: string | number } | [produk: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: preview.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

preview.form = previewForm

/**
* @see \App\Http\Controllers\ProdukController::create
* @see app/Http/Controllers/ProdukController.php:192
* @route '/produk/buat/baru'
*/
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/produk/buat/baru',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ProdukController::create
* @see app/Http/Controllers/ProdukController.php:192
* @route '/produk/buat/baru'
*/
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProdukController::create
* @see app/Http/Controllers/ProdukController.php:192
* @route '/produk/buat/baru'
*/
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ProdukController::create
* @see app/Http/Controllers/ProdukController.php:192
* @route '/produk/buat/baru'
*/
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ProdukController::create
* @see app/Http/Controllers/ProdukController.php:192
* @route '/produk/buat/baru'
*/
const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ProdukController::create
* @see app/Http/Controllers/ProdukController.php:192
* @route '/produk/buat/baru'
*/
createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ProdukController::create
* @see app/Http/Controllers/ProdukController.php:192
* @route '/produk/buat/baru'
*/
createForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

create.form = createForm

/**
* @see \App\Http\Controllers\ProdukController::store
* @see app/Http/Controllers/ProdukController.php:451
* @route '/produk/store'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/produk/store',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ProdukController::store
* @see app/Http/Controllers/ProdukController.php:451
* @route '/produk/store'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProdukController::store
* @see app/Http/Controllers/ProdukController.php:451
* @route '/produk/store'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ProdukController::store
* @see app/Http/Controllers/ProdukController.php:451
* @route '/produk/store'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ProdukController::store
* @see app/Http/Controllers/ProdukController.php:451
* @route '/produk/store'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\ProdukController::edit
* @see app/Http/Controllers/ProdukController.php:200
* @route '/produk/{produk}/edit'
*/
export const edit = (args: { produk: string | number } | [produk: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/produk/{produk}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ProdukController::edit
* @see app/Http/Controllers/ProdukController.php:200
* @route '/produk/{produk}/edit'
*/
edit.url = (args: { produk: string | number } | [produk: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { produk: args }
    }

    if (Array.isArray(args)) {
        args = {
            produk: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        produk: args.produk,
    }

    return edit.definition.url
            .replace('{produk}', parsedArgs.produk.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProdukController::edit
* @see app/Http/Controllers/ProdukController.php:200
* @route '/produk/{produk}/edit'
*/
edit.get = (args: { produk: string | number } | [produk: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ProdukController::edit
* @see app/Http/Controllers/ProdukController.php:200
* @route '/produk/{produk}/edit'
*/
edit.head = (args: { produk: string | number } | [produk: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ProdukController::edit
* @see app/Http/Controllers/ProdukController.php:200
* @route '/produk/{produk}/edit'
*/
const editForm = (args: { produk: string | number } | [produk: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ProdukController::edit
* @see app/Http/Controllers/ProdukController.php:200
* @route '/produk/{produk}/edit'
*/
editForm.get = (args: { produk: string | number } | [produk: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ProdukController::edit
* @see app/Http/Controllers/ProdukController.php:200
* @route '/produk/{produk}/edit'
*/
editForm.head = (args: { produk: string | number } | [produk: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

edit.form = editForm

/**
* @see \App\Http\Controllers\ProdukController::update
* @see app/Http/Controllers/ProdukController.php:212
* @route '/produk/{produk}/update'
*/
export const update = (args: { produk: string | number } | [produk: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/produk/{produk}/update',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\ProdukController::update
* @see app/Http/Controllers/ProdukController.php:212
* @route '/produk/{produk}/update'
*/
update.url = (args: { produk: string | number } | [produk: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { produk: args }
    }

    if (Array.isArray(args)) {
        args = {
            produk: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        produk: args.produk,
    }

    return update.definition.url
            .replace('{produk}', parsedArgs.produk.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProdukController::update
* @see app/Http/Controllers/ProdukController.php:212
* @route '/produk/{produk}/update'
*/
update.put = (args: { produk: string | number } | [produk: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\ProdukController::update
* @see app/Http/Controllers/ProdukController.php:212
* @route '/produk/{produk}/update'
*/
const updateForm = (args: { produk: string | number } | [produk: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ProdukController::update
* @see app/Http/Controllers/ProdukController.php:212
* @route '/produk/{produk}/update'
*/
updateForm.put = (args: { produk: string | number } | [produk: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

update.form = updateForm

/**
* @see \App\Http\Controllers\ProdukController::toggleActive
* @see app/Http/Controllers/ProdukController.php:554
* @route '/produk/{produk}/toggle-active'
*/
export const toggleActive = (args: { produk: string | number } | [produk: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: toggleActive.url(args, options),
    method: 'put',
})

toggleActive.definition = {
    methods: ["put"],
    url: '/produk/{produk}/toggle-active',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\ProdukController::toggleActive
* @see app/Http/Controllers/ProdukController.php:554
* @route '/produk/{produk}/toggle-active'
*/
toggleActive.url = (args: { produk: string | number } | [produk: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { produk: args }
    }

    if (Array.isArray(args)) {
        args = {
            produk: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        produk: args.produk,
    }

    return toggleActive.definition.url
            .replace('{produk}', parsedArgs.produk.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProdukController::toggleActive
* @see app/Http/Controllers/ProdukController.php:554
* @route '/produk/{produk}/toggle-active'
*/
toggleActive.put = (args: { produk: string | number } | [produk: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: toggleActive.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\ProdukController::toggleActive
* @see app/Http/Controllers/ProdukController.php:554
* @route '/produk/{produk}/toggle-active'
*/
const toggleActiveForm = (args: { produk: string | number } | [produk: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: toggleActive.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ProdukController::toggleActive
* @see app/Http/Controllers/ProdukController.php:554
* @route '/produk/{produk}/toggle-active'
*/
toggleActiveForm.put = (args: { produk: string | number } | [produk: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: toggleActive.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

toggleActive.form = toggleActiveForm

/**
* @see \App\Http\Controllers\ProdukController::addToQueue
* @see app/Http/Controllers/ProdukController.php:603
* @route '/produk/bulk-queue'
*/
export const addToQueue = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: addToQueue.url(options),
    method: 'post',
})

addToQueue.definition = {
    methods: ["post"],
    url: '/produk/bulk-queue',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ProdukController::addToQueue
* @see app/Http/Controllers/ProdukController.php:603
* @route '/produk/bulk-queue'
*/
addToQueue.url = (options?: RouteQueryOptions) => {
    return addToQueue.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProdukController::addToQueue
* @see app/Http/Controllers/ProdukController.php:603
* @route '/produk/bulk-queue'
*/
addToQueue.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: addToQueue.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ProdukController::addToQueue
* @see app/Http/Controllers/ProdukController.php:603
* @route '/produk/bulk-queue'
*/
const addToQueueForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: addToQueue.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ProdukController::addToQueue
* @see app/Http/Controllers/ProdukController.php:603
* @route '/produk/bulk-queue'
*/
addToQueueForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: addToQueue.url(options),
    method: 'post',
})

addToQueue.form = addToQueueForm

/**
* @see \App\Http\Controllers\ProdukController::removeFromQueue
* @see app/Http/Controllers/ProdukController.php:615
* @route '/produk/bulk-remove/{product}'
*/
export const removeFromQueue = (args: { product: string | number | { id: string | number } } | [product: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: removeFromQueue.url(args, options),
    method: 'post',
})

removeFromQueue.definition = {
    methods: ["post"],
    url: '/produk/bulk-remove/{product}',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ProdukController::removeFromQueue
* @see app/Http/Controllers/ProdukController.php:615
* @route '/produk/bulk-remove/{product}'
*/
removeFromQueue.url = (args: { product: string | number | { id: string | number } } | [product: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { product: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { product: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            product: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        product: typeof args.product === 'object'
        ? args.product.id
        : args.product,
    }

    return removeFromQueue.definition.url
            .replace('{product}', parsedArgs.product.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProdukController::removeFromQueue
* @see app/Http/Controllers/ProdukController.php:615
* @route '/produk/bulk-remove/{product}'
*/
removeFromQueue.post = (args: { product: string | number | { id: string | number } } | [product: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: removeFromQueue.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ProdukController::removeFromQueue
* @see app/Http/Controllers/ProdukController.php:615
* @route '/produk/bulk-remove/{product}'
*/
const removeFromQueueForm = (args: { product: string | number | { id: string | number } } | [product: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: removeFromQueue.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ProdukController::removeFromQueue
* @see app/Http/Controllers/ProdukController.php:615
* @route '/produk/bulk-remove/{product}'
*/
removeFromQueueForm.post = (args: { product: string | number | { id: string | number } } | [product: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: removeFromQueue.url(args, options),
    method: 'post',
})

removeFromQueue.form = removeFromQueueForm

/**
* @see \App\Http\Controllers\ProdukController::removeFromQueueAll
* @see app/Http/Controllers/ProdukController.php:621
* @route '/produk/bulk-remove-all'
*/
export const removeFromQueueAll = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: removeFromQueueAll.url(options),
    method: 'post',
})

removeFromQueueAll.definition = {
    methods: ["post"],
    url: '/produk/bulk-remove-all',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ProdukController::removeFromQueueAll
* @see app/Http/Controllers/ProdukController.php:621
* @route '/produk/bulk-remove-all'
*/
removeFromQueueAll.url = (options?: RouteQueryOptions) => {
    return removeFromQueueAll.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProdukController::removeFromQueueAll
* @see app/Http/Controllers/ProdukController.php:621
* @route '/produk/bulk-remove-all'
*/
removeFromQueueAll.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: removeFromQueueAll.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ProdukController::removeFromQueueAll
* @see app/Http/Controllers/ProdukController.php:621
* @route '/produk/bulk-remove-all'
*/
const removeFromQueueAllForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: removeFromQueueAll.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ProdukController::removeFromQueueAll
* @see app/Http/Controllers/ProdukController.php:621
* @route '/produk/bulk-remove-all'
*/
removeFromQueueAllForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: removeFromQueueAll.url(options),
    method: 'post',
})

removeFromQueueAll.form = removeFromQueueAllForm

/**
* @see \App\Http\Controllers\ProdukController::bulkPriceIndex
* @see app/Http/Controllers/ProdukController.php:627
* @route '/produk/bulk-price'
*/
export const bulkPriceIndex = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: bulkPriceIndex.url(options),
    method: 'get',
})

bulkPriceIndex.definition = {
    methods: ["get","head"],
    url: '/produk/bulk-price',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ProdukController::bulkPriceIndex
* @see app/Http/Controllers/ProdukController.php:627
* @route '/produk/bulk-price'
*/
bulkPriceIndex.url = (options?: RouteQueryOptions) => {
    return bulkPriceIndex.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProdukController::bulkPriceIndex
* @see app/Http/Controllers/ProdukController.php:627
* @route '/produk/bulk-price'
*/
bulkPriceIndex.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: bulkPriceIndex.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ProdukController::bulkPriceIndex
* @see app/Http/Controllers/ProdukController.php:627
* @route '/produk/bulk-price'
*/
bulkPriceIndex.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: bulkPriceIndex.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ProdukController::bulkPriceIndex
* @see app/Http/Controllers/ProdukController.php:627
* @route '/produk/bulk-price'
*/
const bulkPriceIndexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: bulkPriceIndex.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ProdukController::bulkPriceIndex
* @see app/Http/Controllers/ProdukController.php:627
* @route '/produk/bulk-price'
*/
bulkPriceIndexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: bulkPriceIndex.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ProdukController::bulkPriceIndex
* @see app/Http/Controllers/ProdukController.php:627
* @route '/produk/bulk-price'
*/
bulkPriceIndexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: bulkPriceIndex.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

bulkPriceIndex.form = bulkPriceIndexForm

/**
* @see \App\Http\Controllers\ProdukController::processQueuePrice
* @see app/Http/Controllers/ProdukController.php:677
* @route '/produk/bulk-process-price'
*/
export const processQueuePrice = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: processQueuePrice.url(options),
    method: 'post',
})

processQueuePrice.definition = {
    methods: ["post"],
    url: '/produk/bulk-process-price',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ProdukController::processQueuePrice
* @see app/Http/Controllers/ProdukController.php:677
* @route '/produk/bulk-process-price'
*/
processQueuePrice.url = (options?: RouteQueryOptions) => {
    return processQueuePrice.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProdukController::processQueuePrice
* @see app/Http/Controllers/ProdukController.php:677
* @route '/produk/bulk-process-price'
*/
processQueuePrice.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: processQueuePrice.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ProdukController::processQueuePrice
* @see app/Http/Controllers/ProdukController.php:677
* @route '/produk/bulk-process-price'
*/
const processQueuePriceForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: processQueuePrice.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ProdukController::processQueuePrice
* @see app/Http/Controllers/ProdukController.php:677
* @route '/produk/bulk-process-price'
*/
processQueuePriceForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: processQueuePrice.url(options),
    method: 'post',
})

processQueuePrice.form = processQueuePriceForm

/**
* @see \App\Http\Controllers\ProdukController::addToQueueAlumunium
* @see app/Http/Controllers/ProdukController.php:871
* @route '/produk/bulk-queue-alumunium'
*/
export const addToQueueAlumunium = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: addToQueueAlumunium.url(options),
    method: 'post',
})

addToQueueAlumunium.definition = {
    methods: ["post"],
    url: '/produk/bulk-queue-alumunium',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ProdukController::addToQueueAlumunium
* @see app/Http/Controllers/ProdukController.php:871
* @route '/produk/bulk-queue-alumunium'
*/
addToQueueAlumunium.url = (options?: RouteQueryOptions) => {
    return addToQueueAlumunium.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProdukController::addToQueueAlumunium
* @see app/Http/Controllers/ProdukController.php:871
* @route '/produk/bulk-queue-alumunium'
*/
addToQueueAlumunium.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: addToQueueAlumunium.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ProdukController::addToQueueAlumunium
* @see app/Http/Controllers/ProdukController.php:871
* @route '/produk/bulk-queue-alumunium'
*/
const addToQueueAlumuniumForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: addToQueueAlumunium.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ProdukController::addToQueueAlumunium
* @see app/Http/Controllers/ProdukController.php:871
* @route '/produk/bulk-queue-alumunium'
*/
addToQueueAlumuniumForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: addToQueueAlumunium.url(options),
    method: 'post',
})

addToQueueAlumunium.form = addToQueueAlumuniumForm

/**
* @see \App\Http\Controllers\ProdukController::removeFromQueueAlumunium
* @see app/Http/Controllers/ProdukController.php:881
* @route '/produk/bulk-remove-alumunium/{product}'
*/
export const removeFromQueueAlumunium = (args: { product: string | number | { id: string | number } } | [product: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: removeFromQueueAlumunium.url(args, options),
    method: 'post',
})

removeFromQueueAlumunium.definition = {
    methods: ["post"],
    url: '/produk/bulk-remove-alumunium/{product}',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ProdukController::removeFromQueueAlumunium
* @see app/Http/Controllers/ProdukController.php:881
* @route '/produk/bulk-remove-alumunium/{product}'
*/
removeFromQueueAlumunium.url = (args: { product: string | number | { id: string | number } } | [product: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { product: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { product: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            product: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        product: typeof args.product === 'object'
        ? args.product.id
        : args.product,
    }

    return removeFromQueueAlumunium.definition.url
            .replace('{product}', parsedArgs.product.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProdukController::removeFromQueueAlumunium
* @see app/Http/Controllers/ProdukController.php:881
* @route '/produk/bulk-remove-alumunium/{product}'
*/
removeFromQueueAlumunium.post = (args: { product: string | number | { id: string | number } } | [product: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: removeFromQueueAlumunium.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ProdukController::removeFromQueueAlumunium
* @see app/Http/Controllers/ProdukController.php:881
* @route '/produk/bulk-remove-alumunium/{product}'
*/
const removeFromQueueAlumuniumForm = (args: { product: string | number | { id: string | number } } | [product: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: removeFromQueueAlumunium.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ProdukController::removeFromQueueAlumunium
* @see app/Http/Controllers/ProdukController.php:881
* @route '/produk/bulk-remove-alumunium/{product}'
*/
removeFromQueueAlumuniumForm.post = (args: { product: string | number | { id: string | number } } | [product: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: removeFromQueueAlumunium.url(args, options),
    method: 'post',
})

removeFromQueueAlumunium.form = removeFromQueueAlumuniumForm

/**
* @see \App\Http\Controllers\ProdukController::removeFromQueueAllAlumunium
* @see app/Http/Controllers/ProdukController.php:887
* @route '/produk/bulk-remove-all-alumunium'
*/
export const removeFromQueueAllAlumunium = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: removeFromQueueAllAlumunium.url(options),
    method: 'post',
})

removeFromQueueAllAlumunium.definition = {
    methods: ["post"],
    url: '/produk/bulk-remove-all-alumunium',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ProdukController::removeFromQueueAllAlumunium
* @see app/Http/Controllers/ProdukController.php:887
* @route '/produk/bulk-remove-all-alumunium'
*/
removeFromQueueAllAlumunium.url = (options?: RouteQueryOptions) => {
    return removeFromQueueAllAlumunium.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProdukController::removeFromQueueAllAlumunium
* @see app/Http/Controllers/ProdukController.php:887
* @route '/produk/bulk-remove-all-alumunium'
*/
removeFromQueueAllAlumunium.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: removeFromQueueAllAlumunium.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ProdukController::removeFromQueueAllAlumunium
* @see app/Http/Controllers/ProdukController.php:887
* @route '/produk/bulk-remove-all-alumunium'
*/
const removeFromQueueAllAlumuniumForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: removeFromQueueAllAlumunium.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ProdukController::removeFromQueueAllAlumunium
* @see app/Http/Controllers/ProdukController.php:887
* @route '/produk/bulk-remove-all-alumunium'
*/
removeFromQueueAllAlumuniumForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: removeFromQueueAllAlumunium.url(options),
    method: 'post',
})

removeFromQueueAllAlumunium.form = removeFromQueueAllAlumuniumForm

/**
* @see \App\Http\Controllers\ProdukController::bulkPriceAlumuniumIndex
* @see app/Http/Controllers/ProdukController.php:841
* @route '/produk/bulk-price-alumunium'
*/
export const bulkPriceAlumuniumIndex = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: bulkPriceAlumuniumIndex.url(options),
    method: 'get',
})

bulkPriceAlumuniumIndex.definition = {
    methods: ["get","head"],
    url: '/produk/bulk-price-alumunium',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ProdukController::bulkPriceAlumuniumIndex
* @see app/Http/Controllers/ProdukController.php:841
* @route '/produk/bulk-price-alumunium'
*/
bulkPriceAlumuniumIndex.url = (options?: RouteQueryOptions) => {
    return bulkPriceAlumuniumIndex.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProdukController::bulkPriceAlumuniumIndex
* @see app/Http/Controllers/ProdukController.php:841
* @route '/produk/bulk-price-alumunium'
*/
bulkPriceAlumuniumIndex.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: bulkPriceAlumuniumIndex.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ProdukController::bulkPriceAlumuniumIndex
* @see app/Http/Controllers/ProdukController.php:841
* @route '/produk/bulk-price-alumunium'
*/
bulkPriceAlumuniumIndex.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: bulkPriceAlumuniumIndex.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ProdukController::bulkPriceAlumuniumIndex
* @see app/Http/Controllers/ProdukController.php:841
* @route '/produk/bulk-price-alumunium'
*/
const bulkPriceAlumuniumIndexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: bulkPriceAlumuniumIndex.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ProdukController::bulkPriceAlumuniumIndex
* @see app/Http/Controllers/ProdukController.php:841
* @route '/produk/bulk-price-alumunium'
*/
bulkPriceAlumuniumIndexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: bulkPriceAlumuniumIndex.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ProdukController::bulkPriceAlumuniumIndex
* @see app/Http/Controllers/ProdukController.php:841
* @route '/produk/bulk-price-alumunium'
*/
bulkPriceAlumuniumIndexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: bulkPriceAlumuniumIndex.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

bulkPriceAlumuniumIndex.form = bulkPriceAlumuniumIndexForm

/**
* @see \App\Http\Controllers\ProdukController::processQueuePriceAlumunium
* @see app/Http/Controllers/ProdukController.php:894
* @route '/produk/bulk-process-price-alumunium'
*/
export const processQueuePriceAlumunium = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: processQueuePriceAlumunium.url(options),
    method: 'post',
})

processQueuePriceAlumunium.definition = {
    methods: ["post"],
    url: '/produk/bulk-process-price-alumunium',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ProdukController::processQueuePriceAlumunium
* @see app/Http/Controllers/ProdukController.php:894
* @route '/produk/bulk-process-price-alumunium'
*/
processQueuePriceAlumunium.url = (options?: RouteQueryOptions) => {
    return processQueuePriceAlumunium.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProdukController::processQueuePriceAlumunium
* @see app/Http/Controllers/ProdukController.php:894
* @route '/produk/bulk-process-price-alumunium'
*/
processQueuePriceAlumunium.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: processQueuePriceAlumunium.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ProdukController::processQueuePriceAlumunium
* @see app/Http/Controllers/ProdukController.php:894
* @route '/produk/bulk-process-price-alumunium'
*/
const processQueuePriceAlumuniumForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: processQueuePriceAlumunium.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ProdukController::processQueuePriceAlumunium
* @see app/Http/Controllers/ProdukController.php:894
* @route '/produk/bulk-process-price-alumunium'
*/
processQueuePriceAlumuniumForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: processQueuePriceAlumunium.url(options),
    method: 'post',
})

processQueuePriceAlumunium.form = processQueuePriceAlumuniumForm

const ProdukController = { index, show, preview, create, store, edit, update, toggleActive, addToQueue, removeFromQueue, removeFromQueueAll, bulkPriceIndex, processQueuePrice, addToQueueAlumunium, removeFromQueueAlumunium, removeFromQueueAllAlumunium, bulkPriceAlumuniumIndex, processQueuePriceAlumunium }

export default ProdukController